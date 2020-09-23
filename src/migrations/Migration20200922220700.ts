import { Migration } from '@mikro-orm/migrations';

export class Migration20200922220700 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "username" varchar(255) not null, "name" varchar(255) not null, "email" varchar(255) not null, "password_hash" varchar(255) not null, "active" bool not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
  }

}
