import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserAccountSyncIndex1587906643180 implements MigrationInterface {
  name = 'UserAccountSyncIndex1587906643180';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_2eef64213ff1f87ea81e128062f747bc"`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_2eef64213ff1f87ea81e128062f747bc" ON "user_account" ("shortId") `,
      undefined,
    );
  }
}
