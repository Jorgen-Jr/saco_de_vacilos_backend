import { MyContext } from "../types";
import { Resolver, Query, Mutation, Arg, Ctx, Int } from "type-graphql";
import { Post } from "../entities/Post";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(): Promise<Post[]> {
    return Post.find();
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("identifier", () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @Query(() => [Post])
  postsByAuthor(@Arg("authot") author: number): Promise<Post[]> {
    return Post.find({ where: { author } });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg("guilty") guilty: number,
    @Arg("content") content: string,
    @Arg("initial_balance") initial_balance: number,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    const user_id = req.session.user_id;
    const actual_guilty = guilty || user_id;

    const post = await Post.create({
      author: user_id,
      guilty: actual_guilty,
      content,
      initial_balance,
      deserved_count: 0,
      undeserved_count: 0,
      view_count: 0,
      status: "U",
      active: true,
    }).save();

    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("identifier") id: number,
    @Arg("content") content: string,
    @Arg("deserve_count") deserved_count: number,
    @Arg("undeserved_count") undeserved_count: number
  ): Promise<Post | null> {
    const post = await Post.findOne(id);

    if (!post) {
      return null;
    }

    Post.update(
      { id },
      {
        content,
        deserved_count,
        undeserved_count,
      }
    );

    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("identifier") id: number): Promise<Boolean> {
    await Post.delete(id);

    return true;
  }
}
