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
  ObjectType,
} from "type-graphql";
import { Post } from "../entities/Post";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";
import { PostUserAction } from "../entities/PostUserAction";

@InputType()
class PostInput {
  @Field()
  content: string;

  @Field()
  initial_balance: number;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];

  @Field()
  hasMore: Boolean;
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

  @Query(() => PaginatedPosts)
  async feed(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string
    // @Ctx() { req }: MyContext
  ): Promise<PaginatedPosts> {
    // const user_id = req.session.user_id;

    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    const replacements: any[] = [realLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(cursor));
    }

    const posts = await getConnection().query(
      `
    select post.*,
    json_build_object(
      'id', author.id,
      'name', author.name,
      'username', author.username
    ) as author
    from post
    inner join public.user as author on author.id = post."authorId"
    ${cursor ? `where post."createdAt" < $2` : ""}
    order by post."createdAt" DESC
    limit $1
    `,
      replacements
    );

    // //TODO the correct way is to order by createdAt but postgres is messing with me and I'm tired =u=)>
    // //I'll be back to this issue, probably =u=)>
    // // Am actually, this got kinda wacky, so I'm gonna get rid of it.
    // const postsQuery = getConnection()
    //   .getRepository(Post)
    //   .createQueryBuilder("feed")
    //   .innerJoinAndSelect("feed.author", "user", 'user.id = feed."authorId"')
    //   .distinctOn(["feed.id", 'feed."createdAt"'])
    //   .orderBy("feed.id", "DESC")
    //   .take(realLimitPlusOne);

    // if (cursor) {
    //   postsQuery.where('feed."createdAt" < :cursor', {
    //     cursor: new Date(cursor),
    //   });
    // }

    // const posts = await postsQuery.getMany();

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
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
      score: 0,
      view_count: 0,
      status: "U",
      active: true,
    }).save();

    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("identifier") id: number,
    @Arg("content") content: string
  ): Promise<Post | null> {
    const post = await Post.findOne(id);

    if (!post) {
      return null;
    }

    Post.update(
      { id },
      {
        content,
      }
    );

    return post;
  }

  @Mutation(() => Boolean, { nullable: true })
  @UseMiddleware(isAuth)
  async vote(
    @Arg("post_id", () => Int) post_id: number,
    @Arg("value") value: number,
    @Ctx() { req }: MyContext
  ) {
    const isDeserved = value !== -1;
    const realValue = isDeserved ? 1 : -1;

    const { user_id } = req.session;

    const user_action = await PostUserAction.findOne({
      where: { author: user_id, post: post_id },
    });

    //The user has voted before and it's updating the vote.
    if (user_action && user_action.value !== realValue) {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
            update post_user_action
            set value=$1
            where "postId" = $2 and "authorId" = $3
          `,
          [realValue, post_id, user_id]
        );

        await tm.query(
          `
          update post
          set score=score+$1
          where id= $2
          `,
          [2 * realValue, post_id]
        );
      });
    } else if (!user_action) {
      //Has never voted before
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
            insert into post_user_action ("authorId", "postId", value)
            values($1, $2, $3)
          `,
          [user_id, post_id, realValue]
        );

        await tm.query(
          `
            update post
            set score=score+$1
            where id= $2
          `,
          [realValue, post_id]
        );
      });
    }

    return true;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("identifier") id: number): Promise<Boolean> {
    await Post.delete(id);

    return true;
  }
}
