import { MyContext } from "../types";
import { Resolver, Query, Mutation, Arg, Ctx, Int } from "type-graphql";
import { UserSettings } from "../entities/UserSettings";

@Resolver()
export class UserSettingsResolver {
  @Query(() => [UserSettings])
  usersProfile(): Promise<UserSettings[]> {
    return UserSettings.find();
  }

  @Query(() => UserSettings, { nullable: true })
  userProfile(
    @Arg("identifier", () => Int) user: number
  ): Promise<UserSettings | undefined> {
    return UserSettings.findOne(user);
  }

  @Mutation(() => UserSettings)
  async createUserSettings(
    @Arg("notification_comments") notification_comments: Boolean,
    @Arg("notification_follower") notification_follower: Boolean,
    @Arg("notification_mentions") notification_mentions: Boolean
  ): Promise<UserSettings> {
    const user_settings = UserSettings.create({
      notification_comments,
      notification_follower,
      notification_mentions,
    }).save();

    return user_settings;
  }

  @Mutation(() => UserSettings, { nullable: true })
  async updateUserSettings(
    @Arg("user_id") user: number,
    @Arg("notification_comments", { nullable: true })
    notification_comments: boolean,
    @Arg("notification_follower", { nullable: true })
    notification_follower: boolean,
    @Arg("notification_mentions", { nullable: true })
    notification_mentions: boolean
  ): Promise<UserSettings | undefined> {
    const user_settings = await UserSettings.findOne(user);

    if (!user_settings) {
      return undefined;
    }

    user_settings.notification_comments = notification_comments;
    user_settings.notification_follower = notification_follower;
    user_settings.notification_mentions = notification_mentions;

    await user_settings.save();

    return user_settings;
  }
}
