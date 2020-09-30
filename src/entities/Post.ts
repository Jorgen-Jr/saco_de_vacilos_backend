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
  @Column({ type: "float" })
  initial_balance!: number;

  @Field(() => Number)
  @Column({ type: "float" })
  deserved_count: Number;

  @Field(() => Number)
  @Column({ type: "float" })
  undeserved_count: Number;

  @Field(() => Number)
  @Column()
  view_count: Number;

  @Field(() => String)
  @Column()
  status!: String;

  @Field(() => Boolean)
  @Column({ default: true })
  active!: Boolean;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => User)
  @ManyToOne(() => User)
  author: User;

  @Field(() => User)
  @ManyToOne(() => User)
  guilty: User;
}
