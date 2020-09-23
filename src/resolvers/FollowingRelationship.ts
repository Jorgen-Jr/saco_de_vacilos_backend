import { FollowingRelationship } from "../entities/FollowingRelationship";
import { MyContext } from "../types";
import { Resolver, Query, Mutation, Arg, Ctx, Int } from "type-graphql";

@Resolver()
export class FollowingRelationshipResolver {
  @Query(() => [FollowingRelationship])
  indexfollowingrelationship(
    @Ctx() { em }: MyContext
  ): Promise<FollowingRelationship[]> {
    return em.find(FollowingRelationship, {});
  }

  @Query(() => FollowingRelationship, { nullable: true })
  following(
    @Arg("user", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<FollowingRelationship | null> {
    return em.findOne(FollowingRelationship, { user: id });
  }

  @Query(() => [FollowingRelationship], { nullable: true })
  followers(
    @Arg("user", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<FollowingRelationship[] | null> {
    return em.find(FollowingRelationship, { following: id });
  }

  @Mutation(() => FollowingRelationship)
  async follow(
    @Arg("user") user: number,
    @Arg("follow") follow: number,
    @Ctx() { em }: MyContext
  ): Promise<FollowingRelationship> {
    const following_relationshipt = em.create(FollowingRelationship, {
      user,
      following: follow,
    });

    await em.persistAndFlush(following_relationshipt);

    return following_relationshipt;
  }

  @Mutation(() => Boolean)
  async unfollow(
    @Arg("user") id: number,
    @Arg("following") following_id: number,
    @Ctx() { em }: MyContext
  ): Promise<Boolean> {
    await em.nativeDelete(FollowingRelationship, {
      id,
      following: following_id,
    });

    return true;
  }
}
