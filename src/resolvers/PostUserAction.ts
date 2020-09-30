import { MyContext } from "../types";
import { Resolver, Query, Mutation, Arg, Ctx, Int } from "type-graphql";
import { PostUserAction } from "../entities/PostUserAction";
import { User } from "../entities/User";
import { Post } from "../entities/Post";

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
    @Arg("post") post_id: number,
    @Arg("action") action: string,
    @Ctx() { req }: MyContext
  ): Promise<PostUserAction> {
    const author = await User.findOne(req.session.user_id);

    const post = await Post.findOne(post_id);

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
