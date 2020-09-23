import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @Field(() => String)
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property()
  username!: string;

  @Field(() => String)
  @Property()
  name!: string;

  @Field(() => String)
  @Property()
  email!: string;

  @Property({ persist: false })
  password!: string;

  @Field(() => String)
  @Property()
  password_hash!: string;

  @Field(() => String)
  @Property({ default: true })
  active!: Boolean;

  @Property({ type: "date" })
  createdAt = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}
