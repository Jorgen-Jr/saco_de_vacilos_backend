import { MyContext } from "../types";
import { Resolver, Query, Mutation, Arg, Ctx, Int } from "type-graphql";
import { UserProfile } from "src/entities/UserProfile";

@Resolver()
export class UserProfileResolver {
  @Query(() => [UserProfile])
  usersProfiles(@Ctx() { em }: MyContext): Promise<UserProfile[]> {
    return em.find(UserProfile, {});
  }

  @Query(() => UserProfile, { nullable: true })
  userProfile(
    @Arg("identifier", () => Int) user: number,
    @Ctx() { em }: MyContext
  ): Promise<UserProfile | null> {
    return em.findOne(UserProfile, { user });
  }

  @Mutation(() => UserProfile)
  async createUserProfile(
    @Arg("surname") surname: string,
    @Arg("bio") bio: string,
    @Arg("profile_picture") profile_picture: string,
    @Ctx() { em }: MyContext
  ): Promise<UserProfile> {
    const user = em.create(UserProfile, {
      surname,
      bio,
      profile_picture,
    });

    await em.persistAndFlush(user);

    return user;
  }

  @Mutation(() => UserProfile, { nullable: true })
  async updateUserProfile(
    @Arg("id") id: number,
    @Arg("surname", { nullable: true }) surname: string,
    @Arg("bio", { nullable: true }) bio: string,
    @Arg("profile_picture", { nullable: true }) profile_picture: string,
    @Ctx() { em }: MyContext
  ): Promise<UserProfile | null> {
    const user_profile = await em.findOne(UserProfile, { id });

    if (!user_profile) {
      return null;
    }

    user_profile.surname = surname || user_profile.surname;
    user_profile.bio = bio || user_profile.bio;
    user_profile.profile_picture =
      profile_picture || user_profile.profile_picture;

    await em.persistAndFlush(user_profile);

    return user_profile;
  }
}
