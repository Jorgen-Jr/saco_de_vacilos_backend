import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  username!: string;

  @Property()
  name!: string;

  @Property()
  email!: string;

  @Property({ persist: false })
  password!: string;

  @Property()
  password_hash!: string;

  @Property()
  active!: Boolean;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
