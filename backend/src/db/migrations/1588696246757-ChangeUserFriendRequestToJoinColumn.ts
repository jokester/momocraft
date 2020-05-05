import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeUserFriendRequestToJoinColumn1588696246757 implements MigrationInterface {
  name = 'ChangeUserFriendRequestToJoinColumn1588696246757';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_1712615d387ece11d8236a86fe"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_b78101a53a7d3815eab59baac5"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "user_friend_request" DROP CONSTRAINT "UQ_3ac1e0cf9e7ac33511f4c8d54bb"`,
      undefined,
    );
    await queryRunner.query(`ALTER TABLE "user_friend_request" DROP COLUMN "toInternalUserId"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_friend_request" DROP COLUMN "fromInternalUserId"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_friend_request" ADD "fromUserInternalUserId" integer`, undefined);
    await queryRunner.query(
      `ALTER TABLE "user_friend_request" ADD CONSTRAINT "UQ_0a5c95e13de71cdf1ee45c40812" UNIQUE ("fromUserInternalUserId")`,
      undefined,
    );
    await queryRunner.query(`ALTER TABLE "user_friend_request" ADD "toUserInternalUserId" integer`, undefined);
    await queryRunner.query(
      `ALTER TABLE "user_friend_request" ADD CONSTRAINT "UQ_5e528d83eb10b13463b7ca468c8" UNIQUE ("toUserInternalUserId")`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0a5c95e13de71cdf1ee45c4081" ON "user_friend_request" ("fromUserInternalUserId") `,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5e528d83eb10b13463b7ca468c" ON "user_friend_request" ("toUserInternalUserId") `,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user_friend_request" ADD CONSTRAINT "UQ_b7716dbedc42a0e559d32067259" UNIQUE ("fromUserInternalUserId", "toUserInternalUserId")`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user_friend_request" ADD CONSTRAINT "FK_0a5c95e13de71cdf1ee45c40812" FOREIGN KEY ("fromUserInternalUserId") REFERENCES "user_account"("internalUserId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user_friend_request" ADD CONSTRAINT "FK_5e528d83eb10b13463b7ca468c8" FOREIGN KEY ("toUserInternalUserId") REFERENCES "user_account"("internalUserId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_friend_request" DROP CONSTRAINT "FK_5e528d83eb10b13463b7ca468c8"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user_friend_request" DROP CONSTRAINT "FK_0a5c95e13de71cdf1ee45c40812"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user_friend_request" DROP CONSTRAINT "UQ_b7716dbedc42a0e559d32067259"`,
      undefined,
    );
    await queryRunner.query(`DROP INDEX "IDX_5e528d83eb10b13463b7ca468c"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_0a5c95e13de71cdf1ee45c4081"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "user_friend_request" DROP CONSTRAINT "UQ_5e528d83eb10b13463b7ca468c8"`,
      undefined,
    );
    await queryRunner.query(`ALTER TABLE "user_friend_request" DROP COLUMN "toUserInternalUserId"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "user_friend_request" DROP CONSTRAINT "UQ_0a5c95e13de71cdf1ee45c40812"`,
      undefined,
    );
    await queryRunner.query(`ALTER TABLE "user_friend_request" DROP COLUMN "fromUserInternalUserId"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_friend_request" ADD "fromInternalUserId" integer NOT NULL`, undefined);
    await queryRunner.query(`ALTER TABLE "user_friend_request" ADD "toInternalUserId" integer NOT NULL`, undefined);
    await queryRunner.query(
      `ALTER TABLE "user_friend_request" ADD CONSTRAINT "UQ_3ac1e0cf9e7ac33511f4c8d54bb" UNIQUE ("toInternalUserId", "fromInternalUserId")`,
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
}
