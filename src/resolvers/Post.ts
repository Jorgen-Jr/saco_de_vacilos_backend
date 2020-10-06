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
  UseMiddleware,
} from "type-graphql";
import { Post } from "../entities/Post";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";

@InputType()
class PostInput {
  @Field()
  content: string;

  @Field()
  initial_balance: number;
}

@Resolver(Post)
export class PostResolver {
  @Query(() => [Post])
  posts(): Promise<Post[]> {
    return Post.find({
      relations: ["author", "guilty"],
      order: { updatedAt: "DESC" },
    });
  }

  @Query(() => [Post])
  async feed(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string
    // @Ctx() { req }: MyContext
  ): Promise<Post[] | undefined> {
    // const user_id = req.session.user_id;

    const realLimit = Math.min(50, limit);

    //TODO the correct way is to order by createdAt but postgres is messing with me and I'm tired =u=)>
    //I'll be back to this issue.
    const posts = await getConnection()
      .getRepository(Post)
      .createQueryBuilder("feed")
      .innerJoinAndSelect("feed.author", "user", 'user.id = feed."authorId"')
      .distinctOn(["feed.id", 'feed."createdAt"'])
      .orderBy("feed.id", "DESC")
      .take(realLimit);

    if (cursor) {
      posts.where('feed."createdAt" < :cursor', {
        cursor: new Date(cursor),
      });
    }

    return posts.getMany();
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
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Arg("guilty", { nullable: true }) guilty: number,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    const user_id = req.session.user_id;
    const actual_guilty = guilty || user_id;

    const post = await Post.create({
      ...input,
      authorId: user_id,
      guiltyId: actual_guilty,
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
