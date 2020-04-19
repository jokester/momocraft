import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserAccountMeta1587314629454 implements MigrationInterface {
  name = 'AddUserAccountMeta1587314629454';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_account" ADD "userMeta" jsonb NOT NULL DEFAULT '{}'`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "userMeta"`, undefined);
  }
}
