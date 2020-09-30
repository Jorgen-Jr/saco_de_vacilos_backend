import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ObjectType, Field } from "type-graphql";

import { User } from "./User";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column({ type: "text" })
  content!: string;

  @Field(() => Number)
  @Column({ type: "float", default: 0 })
  initial_balance!: number;

  @Field(() => Number)
  @Column({ type: "int", default: 0 })
  deserved_count: Number;

  @Field(() => Number)
  @Column({ type: "int", default: 0 })
  undeserved_count: Number;

  @Field(() => Number)
  @Column({ type: "int", default: 0 })
  view_count: Number;

  @Field(() => String)
  @Column()
  status!: String;

  @Field(() => Boolean)
  @Column({ default: true })
  active!: Boolean;

  @Field()
  @Column()
  authorId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts)
  author: User;

  @Field()
  @Column()
  guiltyId: number;

  @Field(() => User)
  @ManyToOne(() => User, (guilty) => guilty.guiltyPosts)
  guilty: User;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
