import { Entity, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
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

  @Field(() => Float32Array)
  @Property({ type: "float" })
  initial_balance!: Float32Array;

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

  @Property({ type: "date" })
  createdAt = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field(() => User)
  @OneToOne()
  author: User;

  @Field(() => User)
  @OneToOne()
  guilty: User;
}
