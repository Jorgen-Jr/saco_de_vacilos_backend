import { Entity, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql";

import { User } from "./User";

@ObjectType()
@Entity()
export class FollowingRelationship {
  @Field(() => String)
  @PrimaryKey()
  id!: number;

  @Field(() => User)
  @OneToOne()
  user: User;

  @Field(() => User)
  @OneToOne()
  following: User;

  @Property({ type: "date" })
  createdAt = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}
