import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1584543302464 implements MigrationInterface {
  name = 'CreateUser1584543302464';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "o_auth_account" ("oAuthAccountId" SERIAL NOT NULL, "provider" character varying NOT NULL, "userId" integer NOT NULL, "externalId" character varying NOT NULL, "credentials" json NOT NULL, "userInfo" json NOT NULL, CONSTRAINT "UQ_42eb3c7f23130174f532c0cb818" UNIQUE ("externalId"), CONSTRAINT "PK_7ec04f144072d282e53f755f737" PRIMARY KEY ("oAuthAccountId"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_42eb3c7f23130174f532c0cb81" ON "o_auth_account" ("externalId") `,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "user_account" ("userId" SERIAL NOT NULL, "shortId" character varying NOT NULL, CONSTRAINT "UQ_29e8fec71c57966d1ddf94cdddc" UNIQUE ("shortId"), CONSTRAINT "PK_08023c572a6a0a22798c56d6c17" PRIMARY KEY ("userId"))`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_account"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_42eb3c7f23130174f532c0cb81"`, undefined);
    await queryRunner.query(`DROP TABLE "o_auth_account"`, undefined);
  }
}
