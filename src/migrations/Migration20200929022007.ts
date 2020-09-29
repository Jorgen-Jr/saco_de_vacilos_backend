import { Migration } from '@mikro-orm/migrations';

export class Migration20200929022007 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "post" drop constraint "post_author_id_unique";');

    this.addSql('alter table "post" drop constraint "post_guilty_id_unique";');
  }

}
