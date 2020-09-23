import { Entity, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql";
import { Post } from "./Post";
import { User } from "./User";

@ObjectType()
@Entity()
export class PostUserAction {
  @Field(() => String)
  @PrimaryKey()
  id!: number;

  @Field(() => Post)
  @OneToOne()
  post: Post;

  @Field(() => User)
  @OneToOne()
  author: User;

  @Field(() => String)
  @Property({ type: "char" })
  action: String;

  @Property({ type: "date" })
  createdAt = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}
