import { MyContext } from "../types";
import { Resolver, Query, Mutation, Arg, Ctx, Int } from "type-graphql";
import { Post } from "../entities/Post";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg("identifier", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    return em.findOne(Post, { id });
  }

  @Query(() => [Post])
  postsByAuthor(
    @Arg("authot") author: number,
    @Ctx() { em }: MyContext
  ): Promise<Post[]> {
    return em.find(Post, { author });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg("author") author: number,
    @Arg("guilty") guilty: number,
    @Arg("content") content: string,
    @Arg("initial_balance") initial_balance: number,
    @Ctx() { em }: MyContext
  ): Promise<Post> {
    const post = em.create(Post, {
      author,
      guilty,
      content,
      initial_balance,
      active: true,
    });

    await em.persistAndFlush(post);

    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("identifier") id: number,
    @Arg("content") content: string,
    @Arg("deserve_count") deserve_count: number,
    @Arg("undeserved_count") undeserved_count: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id });

    if (!post) {
      return null;
    }

    post.content = content || post.content;
    post.deserved_count = deserve_count || post.deserved_count;
    post.undeserved_count = undeserved_count || post.undeserved_count;

    await em.persistAndFlush(post);

    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("identifier") id: number,
    @Ctx() { em }: MyContext
  ): Promise<Boolean> {
    await em.nativeDelete(Post, { id });

    return true;
  }
}
