import { FollowingRelationship } from "../entities/FollowingRelationship";
import { Resolver, Query, Mutation, Arg, Int } from "type-graphql";
import { User } from "../entities/User";

@Resolver()
export class FollowingRelationshipResolver {
  @Query(() => [FollowingRelationship])
  indexfollowingrelationship(): Promise<FollowingRelationship[]> {
    return FollowingRelationship.find();
  }

  @Query(() => FollowingRelationship, { nullable: true })
  following(
    @Arg("user", () => Int) id: number
  ): Promise<FollowingRelationship | undefined> {
    return FollowingRelationship.findOne(id);
  }

  @Query(() => [FollowingRelationship], { nullable: true })
  followers(
    @Arg("user", () => Int) id: number
  ): Promise<FollowingRelationship[] | null> {
    return FollowingRelationship.find({ where: { following: id } });
  }

  @Mutation(() => FollowingRelationship)
  async follow(
    @Arg("user") user_id: number,
    @Arg("follow") follow: number
  ): Promise<FollowingRelationship> {
    const user = await User.findOne({ id: user_id });
    const following = await User.findOne({ id: follow });

    const following_relationship = FollowingRelationship.create({
      following,
      user,
    });

    return following_relationship;
  }

  @Mutation(() => Boolean)
  async unfollow(@Arg("identifier") user_id: number): Promise<Boolean> {
    await FollowingRelationship.delete(user_id);

    return true;
  }
}
