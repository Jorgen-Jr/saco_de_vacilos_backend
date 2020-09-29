import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity,
} from "typeorm";
import { ObjectType, Field } from "type-graphql";

import { User } from "./User";

@ObjectType()
@Entity()
export class FollowingRelationship extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => User)
  @OneToOne((type) => User)
  user: User;

  @Field(() => User)
  @OneToOne((type) => User)
  following: User;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt = Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt = Date;
}
