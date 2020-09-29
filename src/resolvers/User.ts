import { User } from "../entities/User";
import { MyContext } from "../types";
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  Int,
  InputType,
  Field,
  ObjectType,
} from "type-graphql";

import argon2 from "argon2";
import { COOKIE_NAME } from "./../constants";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

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

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: MyContext) {
    if (!req.session.user_id) {
      return null;
    }
    const user = await em.findOne(User, { id: req.session.user_id });

    return user;
  }

  @Query(() => [User])
  users(@Ctx() { em }: MyContext): Promise<User[]> {
    return em.find(User, {});
  }

  @Query(() => User, { nullable: true })
  user(
    @Arg("identifier", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<User | null> {
    return em.findOne(User, { id });
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("name") name: string,
    @Arg("email") email: string,
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "Nome de usuário deve ter ao menos 3 caracteres",
          },
        ],
      };
    }

    if (options.password.length <= 6) {
      return {
        errors: [
          {
            field: "password",
            message: "Senha deve ter ao menos 6 caracteres",
          },
        ],
      };
    }

    if (!email) {
      return {
        errors: [
          {
            field: "email",
            message: "E-mail precisa ser válido",
          },
        ],
      };
    }

    const password_hash = await argon2.hash(options.password);

    const user = em.create(User, {
      username: options.username,
      name,
      email,
      password_hash,
      active: true,
    });

    try {
      await em.persistAndFlush(user);
    } catch (err) {
      if (err.details.includes("already exists")) {
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
    // @Arg("email", { nullable: true }) email: string,
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });

    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "Usuário não existe",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password_hash, options.password);

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
    @Arg("password", { nullable: true }) password: string,
    @Ctx() { em }: MyContext
  ): Promise<User | null> {
    const user = await em.findOne(User, { id });

    if (!user) {
      return null;
    }

    user.username = username || user.username;
    user.name = name || user.name;
    user.email = email || user.email;
    user.password_hash = password || user.password;

    await em.persistAndFlush(user);

    return user;
  }

  @Mutation(() => Boolean)
  async deleteUser(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext
  ): Promise<Boolean> {
    await em.nativeDelete(User, { id });

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
}
