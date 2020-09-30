import { MyContext } from "../types";
import { Resolver, Query, Mutation, Arg, Ctx, Int } from "type-graphql";
import { UserProfile } from "src/entities/UserProfile";

@Resolver()
export class UserProfileResolver {
  @Query(() => [UserProfile])
  usersProfiles(): Promise<UserProfile[]> {
    return UserProfile.find();
  }

  @Query(() => UserProfile, { nullable: true })
  userProfile(
    @Arg("identifier", () => Int) user: number
  ): Promise<UserProfile | undefined> {
    return UserProfile.findOne();
  }

  @Mutation(() => UserProfile)
  async createUserProfile(
    @Arg("surname") surname: string,
    @Arg("bio") bio: string,
    @Arg("profile_picture") profile_picture: string
  ): Promise<UserProfile> {
    const user = UserProfile.create({
      surname,
      bio,
      profile_picture,
    }).save();

    return user;
  }

  @Mutation(() => UserProfile, { nullable: true })
  async updateUserProfile(
    @Arg("id") id: number,
    @Arg("surname", { nullable: true }) surname: string,
    @Arg("bio", { nullable: true }) bio: string,
    @Arg("profile_picture", { nullable: true }) profile_picture: string
  ): Promise<UserProfile | undefined> {
    const user_profile = await UserProfile.findOne(id);

    if (!user_profile) {
      return undefined;
    }

    user_profile.surname = surname || user_profile.surname;
    user_profile.bio = bio || user_profile.bio;
    user_profile.profile_picture =
      profile_picture || user_profile.profile_picture;

    await user_profile.save();

    return user_profile;
  }
}
