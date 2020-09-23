import { MyContext } from "../types";
import { Resolver, Query, Mutation, Arg, Ctx, Int } from "type-graphql";
import { PostComment } from "src/entities/PostComment";

@Resolver()
export class PostCommentResolver {
  @Query(() => [PostComment])
  comments(@Ctx() { em }: MyContext): Promise<PostComment[]> {
    return em.find(PostComment, {});
  }

  @Query(() => PostComment, { nullable: true })
  comment(
    @Arg("identifier", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<PostComment | null> {
    return em.findOne(PostComment, { id });
  }

  @Query(() => [PostComment])
  commentsByPost(
    @Arg("post") post: number,
    @Ctx() { em }: MyContext
  ): Promise<PostComment[]> {
    return em.find(PostComment, { post });
  }

  @Mutation(() => PostComment)
  async createComment(
    @Arg("author") author: number,
    @Arg("post") post: number,
    @Arg("content") content: string,
    @Ctx() { em }: MyContext
  ): Promise<PostComment> {
    const comment = em.create(PostComment, {
      author,
      post,
      content,
    });

    await em.persistAndFlush(comment);

    return comment;
  }

  @Mutation(() => PostComment, { nullable: true })
  async updatePost(
    @Arg("identifier") id: number,
    @Arg("content") content: string,
    @Ctx() { em }: MyContext
  ): Promise<PostComment | null> {
    const comment = await em.findOne(PostComment, { id });

    if (!comment) {
      return null;
    }

    comment.content = content || comment.content;

    await em.persistAndFlush(comment);

    return comment;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("identifier") id: number,
    @Ctx() { em }: MyContext
  ): Promise<Boolean> {
    await em.nativeDelete(PostComment, { id });

    return true;
  }
}
