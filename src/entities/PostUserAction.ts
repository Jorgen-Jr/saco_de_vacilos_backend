import { ObjectType, Field } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@ObjectType()
@Entity()
export class PostUserAction extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Post)
  @OneToOne((type) => Post)
  post: Post;

  @Field(() => User)
  @OneToOne((type) => User)
  author: User;

  @Field(() => String)
  @Column({ type: "char" })
  action: String;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt = Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt = Date;
}
