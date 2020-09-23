import { Migration } from '@mikro-orm/migrations';

export class Migration20200923004216 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop constraint if exists "user_active_check";');
    this.addSql('alter table "user" alter column "active" type bool using ("active"::bool);');
    this.addSql('alter table "user" alter column "active" set default true;');
  }

}
