import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserFriendRequest1588689259592 implements MigrationInterface {
  name = 'AddUserFriendRequest1588689259592';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_friend_request" ("userFriendRequestId" SERIAL NOT NULL, "fromInternalUserId" integer NOT NULL, "toInternalUserId" integer NOT NULL, "approved" boolean NOT NULL, "comment" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_3ac1e0cf9e7ac33511f4c8d54bb" UNIQUE ("fromInternalUserId", "toInternalUserId"), CONSTRAINT "PK_4606f1aa09ef76ac24cc244c6a4" PRIMARY KEY ("userFriendRequestId"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b78101a53a7d3815eab59baac5" ON "user_friend_request" ("fromInternalUserId") `,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1712615d387ece11d8236a86fe" ON "user_friend_request" ("toInternalUserId") `,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_1712615d387ece11d8236a86fe"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_b78101a53a7d3815eab59baac5"`, undefined);
    await queryRunner.query(`DROP TABLE "user_friend_request"`, undefined);
  }
}
