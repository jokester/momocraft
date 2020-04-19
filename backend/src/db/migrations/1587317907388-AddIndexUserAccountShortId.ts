import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexUserAccountShortId1587317907388 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE INDEX "IDX_2eef64213ff1f87ea81e128062f747bc" ON "user_account" ("shortId") `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP INDEX "IDX_2eef64213ff1f87ea81e128062f747bc"`);
  }
}
