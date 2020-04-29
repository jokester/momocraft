import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserAccountAddManagedIndex1587906710498 implements MigrationInterface {
  name = 'UserAccountAddManagedIndex1587906710498';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE INDEX "IDX_29e8fec71c57966d1ddf94cddd" ON "user_account" ("shortId") `, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_29e8fec71c57966d1ddf94cddd"`, undefined);
  }
}
