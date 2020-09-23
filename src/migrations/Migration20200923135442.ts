import { Migration } from '@mikro-orm/migrations';

export class Migration20200923135442 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "role" ("id" serial primary key, "name" varchar(255) not null, "description" varchar(255) not null, "active" bool not null default true, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('create table "following_relationship" ("id" serial primary key, "user_id" int4 not null, "following_id" int4 not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "following_relationship" add constraint "following_relationship_user_id_unique" unique ("user_id");');
    this.addSql('alter table "following_relationship" add constraint "following_relationship_following_id_unique" unique ("following_id");');

    this.addSql('create table "post" ("id" serial primary key, "content" text not null, "initial_balance" float not null, "deserved_count" float not null, "undeserved_count" float not null, "view_count" int4 not null, "status" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "author_id" int4 not null, "guilty_id" int4 not null);');
    this.addSql('alter table "post" add constraint "post_author_id_unique" unique ("author_id");');
    this.addSql('alter table "post" add constraint "post_guilty_id_unique" unique ("guilty_id");');

    this.addSql('create table "post_comment" ("id" serial primary key, "post_id" int4 not null, "author_id" int4 not null, "content" text not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "post_comment" add constraint "post_comment_post_id_unique" unique ("post_id");');
    this.addSql('alter table "post_comment" add constraint "post_comment_author_id_unique" unique ("author_id");');

    this.addSql('create table "post_user_action" ("id" serial primary key, "post_id" int4 not null, "author_id" int4 not null, "action" jsonb not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "post_user_action" add constraint "post_user_action_post_id_unique" unique ("post_id");');
    this.addSql('alter table "post_user_action" add constraint "post_user_action_author_id_unique" unique ("author_id");');

    this.addSql('create table "user_profile" ("id" serial primary key, "surname" varchar(255) not null, "bio" text not null, "profile_picture" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" int4 not null);');
    this.addSql('alter table "user_profile" add constraint "user_profile_user_id_unique" unique ("user_id");');

    this.addSql('create table "user_settings" ("id" serial primary key, "notification_comments" bool not null default true, "notification_follower" bool not null default true, "notification_mentions" bool not null default true, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "user_id" int4 not null);');
    this.addSql('alter table "user_settings" add constraint "user_settings_user_id_unique" unique ("user_id");');

    this.addSql('create table "user_roles" ("user_id" int4 not null, "role_id" int4 not null);');
    this.addSql('alter table "user_roles" add constraint "user_roles_pkey" primary key ("user_id", "role_id");');

    this.addSql('alter table "following_relationship" add constraint "following_relationship_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "following_relationship" add constraint "following_relationship_following_id_foreign" foreign key ("following_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "post" add constraint "post_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "post" add constraint "post_guilty_id_foreign" foreign key ("guilty_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "post_comment" add constraint "post_comment_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;');
    this.addSql('alter table "post_comment" add constraint "post_comment_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "post_user_action" add constraint "post_user_action_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;');
    this.addSql('alter table "post_user_action" add constraint "post_user_action_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "user_profile" add constraint "user_profile_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "user_settings" add constraint "user_settings_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "user_roles" add constraint "user_roles_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_roles" add constraint "user_roles_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade on delete cascade;');
  }

}
