import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserAccountAddPasswdAuth1587907073245 implements MigrationInterface {
  name = 'UserAccountAddPasswdAuth1587907073245';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_account" ADD "emailId" character varying NOT NULL`, undefined);
    await queryRunner.query(
      `ALTER TABLE "user_account" ADD CONSTRAINT "UQ_5a581cfd239365e51eed2a4926f" UNIQUE ("emailId")`,
      undefined,
    );
    await queryRunner.query(`ALTER TABLE "user_account" ADD "passwordHash" character varying NOT NULL`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "passwordHash"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_account" DROP CONSTRAINT "UQ_5a581cfd239365e51eed2a4926f"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "emailId"`, undefined);
  }
}
