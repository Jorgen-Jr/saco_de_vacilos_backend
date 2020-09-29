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
import { User } from "./User";

@ObjectType()
@Entity()
export class UserSettings extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Boolean)
  @Column({ default: true })
  notification_comments!: Boolean;

  @Field(() => Boolean)
  @Column({ default: true })
  notification_follower!: Boolean;

  @Field(() => Boolean)
  @Column({ default: true })
  notification_mentions!: Boolean;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt = Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt = Date;

  @Field(() => User)
  @OneToOne((type) => User)
  user: User;
}
