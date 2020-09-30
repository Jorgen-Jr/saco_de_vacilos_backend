import { MyContext } from "../types";
import { Resolver, Query, Mutation, Arg, Ctx, Int } from "type-graphql";
import { PostComment } from "src/entities/PostComment";
import { Post } from "src/entities/Post";
import { User } from "src/entities/User";

@Resolver()
export class PostCommentResolver {
  @Query(() => [PostComment])
  comments(): Promise<PostComment[]> {
    return PostComment.find();
  }

  @Query(() => PostComment, { nullable: true })
  comment(
    @Arg("identifier", () => Int) id: number
  ): Promise<PostComment | undefined> {
    return PostComment.findOne(id);
  }

  @Query(() => [PostComment])
  commentsByPost(@Arg("post") post: number): Promise<PostComment[]> {
    return PostComment.find({ where: { post } });
  }

  @Mutation(() => PostComment)
  async createComment(
    @Arg("post") post_id: number,
    @Arg("content") content: string,
    @Ctx() { req }: MyContext
  ): Promise<PostComment> {
    const author = await User.findOne(req.session.user_id);

    const post = await Post.findOne(post_id);

    const comment = await PostComment.create({
      author,
      post,
      content,
    }).save();

    return comment;
  }

  @Mutation(() => PostComment, { nullable: true })
  async updatePost(
    @Arg("identifier") id: number,
    @Arg("content") content: string
  ): Promise<PostComment | undefined> {
    const comment = await PostComment.findOne(id);

    if (!comment) {
      return undefined;
    }

    PostComment.update({ id }, { content });

    return comment;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("identifier") id: number): Promise<Boolean> {
    await PostComment.delete(id);

    return true;
  }
}
