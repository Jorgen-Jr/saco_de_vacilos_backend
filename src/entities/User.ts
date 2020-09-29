import { ObjectType, Field } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { Role } from "./Role";

@ObjectType()
@Entity()
export class User  extends BaseEntity  {
  @Field(() => String)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column({unique: true })
  username!: string;

  @Field(() => String)
  @Column()
  name!: string;

  @Field(() => String)
  @Column({ unique: true })
  email!: string;

  password!: string;

  @Column()
  password_hash!: string;

  @Field(() => Boolean)
  @Column({ default: true })
  active!: Boolean;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt = Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt = Date;

  @ManyToMany(type=> Role)
  @JoinTable()
  roles = Role[];
}
