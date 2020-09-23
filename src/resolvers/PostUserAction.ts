import { MyContext } from "../types";
import { Resolver, Query, Mutation, Arg, Ctx, Int } from "type-graphql";
import { PostUserAction } from "../entities/PostUserAction";

@Resolver()
export class PostUserActionResolver {
  @Query(() => [PostUserAction])
  postUserActions(@Ctx() { em }: MyContext): Promise<PostUserAction[]> {
    return em.find(PostUserAction, {});
  }

  @Query(() => PostUserAction, { nullable: true })
  postUserAction(
    @Arg("identifier", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<PostUserAction | null> {
    return em.findOne(PostUserAction, { id });
  }

  @Query(() => [PostUserAction])
  userActionByPost(
    @Arg("post") post: number,
    @Ctx() { em }: MyContext
  ): Promise<PostUserAction[]> {
    return em.find(PostUserAction, { post });
  }

  @Mutation(() => PostUserAction)
  async createUserAction(
    @Arg("author") author: number,
    @Arg("post") post: number,
    @Arg("action") action: string,
    @Ctx() { em }: MyContext
  ): Promise<PostUserAction> {
    const user_action = em.create(PostUserAction, {
      author,
      post,
      action,
    });

    await em.persistAndFlush(user_action);

    return user_action;
  }

  @Mutation(() => Boolean)
  async deleteUserAction(
    @Arg("identifier") id: number,
    @Ctx() { em }: MyContext
  ): Promise<Boolean> {
    await em.nativeDelete(PostUserAction, { id });

    return true;
  }
}
