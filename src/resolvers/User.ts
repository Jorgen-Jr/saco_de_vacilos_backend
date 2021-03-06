import { User } from "../entities/User";
import { MyContext } from "../types";
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  Int,
  Field,
  ObjectType,
  FieldResolver,
  Root,
} from "type-graphql";

import argon2 from "argon2";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "./../constants";

import { emailTemplate } from "./../util/emailTemplate";
import { sendEmail } from "../util/sendEmail";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { validateRegister } from "../util/validateRegister";

import { v4 } from "uuid";

@ObjectType()
class FieldError {
  @Field()
  field: String;

  @Field()
  message: String;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    //Allright, It's ok to show him his own email.
    if (req.session.user_id === user.id) {
      return user.email;
    }

    //No his not allowed
    return "";
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    if (!req.session.user_id) {
      return null;
    }
    const user = await User.findOne({ id: req.session.user_id });

    return user;
  }

  @Query(() => [User])
  users(): Promise<User[]> {
    return User.find();
  }

  @Query(() => User, { nullable: true })
  user(@Arg("identifier", () => Int) id: number): Promise<User | undefined> {
    return User.findOne(id);
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options);

    if (errors) {
      return { errors };
    }

    const password_hash = await argon2.hash(options.password);

    const user = await User.create({
      username: options.username,
      name: options.name,
      email: options.email,
      password_hash,
      active: true,
    });

    try {
      await user.save();
    } catch (err) {
      if (err?.details?.includes("already exists")) {
        return {
          errors: [
            {
              field: "username",
              message: "Nome de usuário indisponível",
            },
          ],
        };
      }
      console.log(err.message);
    }

    req.session.user_id = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({
      where: usernameOrEmail.includes("@")
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail },
    });

    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message:
              "Não foi encontrato um usuário com este " +
              (usernameOrEmail.includes("@") ? "email." : "nome."),
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password_hash, password);

    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "Senha incorreta",
          },
        ],
      };
    }

    req.session.user_id = user.id;

    return { user };
  }

  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Arg("id") id: number,
    @Arg("username", { nullable: true }) username: string,
    @Arg("name", { nullable: true }) name: string,
    @Arg("email", { nullable: true }) email: string,
    @Arg("password", { nullable: true }) password: string
  ): Promise<User | undefined> {
    const user = await User.findOne(id);

    if (!user) {
      return undefined;
    }

    User.update(
      { id },
      {
        username,
        name,
        email,
        password_hash: password,
      }
    );

    return user;
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg("id") id: number): Promise<Boolean> {
    await User.delete(id);

    return true;
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext): Promise<Boolean> {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        res.clearCookie(COOKIE_NAME);
        resolve(true);
      })
    );
  }

  @Mutation(() => UserResponse)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ): Promise<UserResponse | boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return {
        errors: [
          {
            field: "email",
            message: "Não existe usuário cadastrado com este email.",
          },
        ],
      };
    }

    const token = v4();

    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3
    ); //Three days

    const content = emailTemplate(
      "http://localhost:3000",
      token,
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftwibbon.blob.core.windows.net%2Ftwibbon%2F2015%2F182%2F35c55ac2-472a-4ffd-87ca-76199321c68c.png&f=1&nofb=1"
    );

    sendEmail(
      '"Saco de Vacilos" <something@someon.eco>',
      user.email,
      "Recuperar Senha 🤦️",
      content
    );

    await user.save();

    return true;
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("password") password: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    if (password.length < 6) {
      return {
        errors: [
          {
            field: "password",
            message: "Senha deve ter ao menos 6 caracteres",
          },
        ],
      };
    }

    const key = FORGET_PASSWORD_PREFIX + token;
    const user_id = await redis.get(key);

    if (!user_id) {
      return {
        errors: [
          {
            field: "token",
            message: "Invalid or expired token.",
          },
        ],
      };
    }

    const user = await User.findOne({ where: { id: parseInt(user_id) } });

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "User no longer exists.",
          },
        ],
      };
    }

    user.password_hash = await argon2.hash(password);

    await user.save();

    req.session.user_id = user.id;

    await redis.del(key);

    return { user };
  }
}
