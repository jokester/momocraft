import { MigrationInterface, QueryRunner } from 'typeorm';

export class OAuthAccountAllowOtherProvider1592492831729 implements MigrationInterface {
  name = 'OAuthAccountAllowOtherProvider1592492831729';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "o_auth_account" DROP CONSTRAINT "UQ_42eb3c7f23130174f532c0cb818"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "o_auth_account" ADD CONSTRAINT "UQ_6ce2b01a279bbde8c69ec45641a" UNIQUE ("provider", "externalId")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "o_auth_account" DROP CONSTRAINT "UQ_6ce2b01a279bbde8c69ec45641a"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "o_auth_account" ADD CONSTRAINT "UQ_42eb3c7f23130174f532c0cb818" UNIQUE ("externalId")`,
      undefined,
    );
  }
}
