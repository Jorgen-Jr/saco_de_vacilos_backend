import { MyContext } from "../types";
import { Resolver, Query, Mutation, Arg, Ctx, Int } from "type-graphql";
import { UserSettings } from "../entities/UserSettings";

@Resolver()
export class UserSettingsResolver {
  @Query(() => [UserSettings])
  usersProfile(@Ctx() { em }: MyContext): Promise<UserSettings[]> {
    return em.find(UserSettings, {});
  }

  @Query(() => UserSettings, { nullable: true })
  userProfile(
    @Arg("identifier", () => Int) user: number,
    @Ctx() { em }: MyContext
  ): Promise<UserSettings | null> {
    return em.findOne(UserSettings, { user });
  }

  @Mutation(() => UserSettings)
  async createUserSettings(
    @Arg("notification_comments") notification_comments: Boolean,
    @Arg("notification_follower") notification_follower: Boolean,
    @Arg("notification_mentions") notification_mentions: Boolean,
    @Ctx() { em }: MyContext
  ): Promise<UserSettings> {
    const user_settings = em.create(UserSettings, {
      notification_comments,
      notification_follower,
      notification_mentions,
    });

    await em.persistAndFlush(user_settings);

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
    notification_mentions: boolean,
    @Ctx() { em }: MyContext
  ): Promise<UserSettings | null> {
    const user_settings = await em.findOne(UserSettings, { user });

    if (!user_settings) {
      return null;
    }

    user_settings.notification_comments = notification_comments;
    user_settings.notification_follower = notification_follower;
    user_settings.notification_mentions = notification_mentions;

    await em.persistAndFlush(user_settings);

    return user_settings;
  }
}
