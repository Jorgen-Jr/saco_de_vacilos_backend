import { User } from "../entities/User";
import { MyContext } from "../types";
import { Resolver, Query, Mutation, Arg, Ctx, Int } from "type-graphql";

@Resolver()
export class UserResolver {
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

  @Mutation(() => User)
  async createUser(
    @Arg("username") username: string,
    @Arg("name") name: string,
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { em }: MyContext
  ): Promise<User> {
    const user = em.create(User, {
      username,
      name,
      email,
      password_hash: password,
      active: true,
    });

    await em.persistAndFlush(user);

    return user;
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
}
