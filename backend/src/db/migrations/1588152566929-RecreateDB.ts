import { MigrationInterface, QueryRunner } from 'typeorm';

export class RecreateDB1588152566929 implements MigrationInterface {
  name = 'RecreateDB1588152566929';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "o_auth_account" ("oAuthAccountId" SERIAL NOT NULL, "provider" character varying NOT NULL, "userId" integer NOT NULL, "externalId" character varying NOT NULL, "credentials" json NOT NULL, "userInfo" json NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_42eb3c7f23130174f532c0cb818" UNIQUE ("externalId"), CONSTRAINT "PK_7ec04f144072d282e53f755f737" PRIMARY KEY ("oAuthAccountId"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_42eb3c7f23130174f532c0cb81" ON "o_auth_account" ("externalId") `,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "user_account" ("internalUserId" SERIAL NOT NULL, "userId" character varying NOT NULL, "emailId" character varying NOT NULL, "passwordHash" character varying NOT NULL, "internalMeta" jsonb NOT NULL DEFAULT '{}', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_08023c572a6a0a22798c56d6c17" UNIQUE ("userId"), CONSTRAINT "UQ_5a581cfd239365e51eed2a4926f" UNIQUE ("emailId"), CONSTRAINT "PK_4e4797b33221e9d07a2c5da5bb9" PRIMARY KEY ("internalUserId"))`,
      undefined,
    );
    await queryRunner.query(`CREATE INDEX "IDX_08023c572a6a0a22798c56d6c1" ON "user_account" ("userId") `, undefined);
    await queryRunner.query(`CREATE INDEX "IDX_5a581cfd239365e51eed2a4926" ON "user_account" ("emailId") `, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_5a581cfd239365e51eed2a4926"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_08023c572a6a0a22798c56d6c1"`, undefined);
    await queryRunner.query(`DROP TABLE "user_account"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_42eb3c7f23130174f532c0cb81"`, undefined);
    await queryRunner.query(`DROP TABLE "o_auth_account"`, undefined);
  }
}
