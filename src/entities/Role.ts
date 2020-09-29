import { ObjectType, Field } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { User } from "./User";

@ObjectType()
@Entity()
export class Role  extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column()
  name!: string;

  @Field(() => String)
  @Column()
  description!: string;

  @Field(() => Boolean)
  @Column({ default: true })
  active!: Boolean;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt = Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt = Date;

  @Field(() => [User])
  @ManyToMany(type => User)
  @JoinTable()
  users = User[];
}
