import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,, BaseEntity
} from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@ObjectType()
@Entity()
export class PostComment  extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Post)
  @ManyToOne((type) => Post)
  post: Post;

  @Field(() => User)
  @OneToOne((type) => User)
  author: User;

  @Field(() => String)
  @Column({ type: "text" })
  content: String;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt = Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt = Date;
}
