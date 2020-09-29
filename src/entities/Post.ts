import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql";

import { User } from "./User";

@ObjectType()
@Entity()
export class Post {
  @Field(() => String)
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "text" })
  content!: string;

  @Field(() => Number)
  @Property({ type: "float" })
  initial_balance!: number;

  @Field(() => Number)
  @Property({ type: "float" })
  deserved_count: Number;

  @Field(() => Number)
  @Property({ type: "float" })
  undeserved_count: Number;

  @Field(() => Number)
  @Property()
  view_count: Number;

  @Field(() => String)
  @Property()
  status!: String;

  @Field(() => Date)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => Date)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field(() => User)
  @ManyToOne()
  author: User;

  @Field(() => User)
  @ManyToOne()
  guilty: User;
}
