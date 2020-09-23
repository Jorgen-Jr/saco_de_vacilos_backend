import { Entity, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity()
export class UserSettings {
  @Field(() => String)
  @PrimaryKey()
  id!: number;

  @Field(() => Boolean)
  @Property({ default: true })
  notification_comments!: Boolean;

  @Field(() => Boolean)
  @Property({ default: true })
  notification_follower!: Boolean;

  @Field(() => Boolean)
  @Property({ default: true })
  notification_mentions!: Boolean;

  @Field(() => Date)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => Date)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field(() => User)
  @OneToOne()
  user: User;
}
