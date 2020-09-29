import { MyContext } from "../types";
import { Resolver, Query, Mutation, Arg, Ctx, Int } from "type-graphql";
import { PostUserAction } from "../entities/PostUserAction";

@Resolver()
export class PostUserActionResolver {
  @Query(() => [PostUserAction])
  postUserActions(): Promise<PostUserAction[]> {
    return PostUserAction.find();
  }

  @Query(() => PostUserAction, { nullable: true })
  postUserAction(
    @Arg("identifier", () => Int) id: number
  ): Promise<PostUserAction | undefined> {
    return PostUserAction.findOne(id);
  }

  @Query(() => [PostUserAction])
  userActionByPost(@Arg("post") post: number): Promise<PostUserAction[]> {
    return PostUserAction.find({ where: { post } });
  }

  @Mutation(() => PostUserAction)
  async createUserAction(
    @Arg("author") author: number,
    @Arg("post") post: number,
    @Arg("action") action: string
  ): Promise<PostUserAction> {
    const user_action = await PostUserAction.create({
      author,
      post,
      action,
    }).save();

    return user_action;
  }

  @Mutation(() => Boolean)
  async deleteUserAction(@Arg("identifier") id: number): Promise<Boolean> {
    await PostUserAction.delete(id);

    return true;
  }
}
