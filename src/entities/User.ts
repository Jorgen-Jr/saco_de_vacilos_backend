import {
  Collection,
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql";

import { Role } from "./Role";

@ObjectType()
@Entity()
export class User {
  @Field(() => String)
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "text", unique: true })
  username!: string;

  @Field(() => String)
  @Property()
  name!: string;

  @Field(() => String)
  @Property({ type: "text", unique: true })
  email!: string;

  @Property({ persist: false })
  password!: string;

  @Property()
  password_hash!: string;

  @Field(() => Boolean)
  @Property({ default: true })
  active!: Boolean;

  @Field(() => Date)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => Date)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @ManyToMany(() => Role, "users", { owner: true })
  roles = new Collection<Role>(this);
}
