import { Entity, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity()
export class UserProfile {
  @Field(() => String)
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property()
  surname!: string;

  @Field(() => String)
  @Property({ type: "text" })
  bio!: String;

  @Field(() => String)
  @Property()
  profile_picture: String;

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
