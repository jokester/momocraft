import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreateUpdateTimestamp1587318828205 implements MigrationInterface {
  name = 'AddCreateUpdateTimestamp1587318828205';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "o_auth_account" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`, undefined);
    await queryRunner.query(`ALTER TABLE "o_auth_account" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`, undefined);
    await queryRunner.query(`ALTER TABLE "user_account" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`, undefined);
    await queryRunner.query(`ALTER TABLE "user_account" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "updatedAt"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "createdAt"`, undefined);
    await queryRunner.query(`ALTER TABLE "o_auth_account" DROP COLUMN "updatedAt"`, undefined);
    await queryRunner.query(`ALTER TABLE "o_auth_account" DROP COLUMN "createdAt"`, undefined);
  }
}
