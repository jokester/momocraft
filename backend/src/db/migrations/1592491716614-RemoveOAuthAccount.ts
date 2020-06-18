import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveOAuthAccount1592491716614 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP INDEX "IDX_42eb3c7f23130174f532c0cb81"`, undefined);
    await queryRunner.query(`DROP TABLE "o_auth_account"`, undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "o_auth_account" ("oAuthAccountId" SERIAL NOT NULL, "provider" character varying NOT NULL, "userId" integer NOT NULL, "externalId" character varying NOT NULL, "credentials" json NOT NULL, "userInfo" json NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_42eb3c7f23130174f532c0cb818" UNIQUE ("externalId"), CONSTRAINT "PK_7ec04f144072d282e53f755f737" PRIMARY KEY ("oAuthAccountId"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_42eb3c7f23130174f532c0cb81" ON "o_auth_account" ("externalId") `,
      undefined,
    );
  }
}
