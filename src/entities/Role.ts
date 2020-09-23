import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql";

import { User } from "./User";

@ObjectType()
@Entity()
export class Role {
  @Field(() => String)
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property()
  name!: string;

  @Field(() => String)
  @Property()
  description!: string;

  @Field(() => Boolean)
  @Property({ default: true })
  active!: Boolean;

  @Property({ type: "date" })
  createdAt = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field(() => [User])
  @ManyToMany(() => User, "roles")
  users = new Collection<User>(this);
}
