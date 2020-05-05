import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeUserFriendRequestToManyToOne1588704558442 implements MigrationInterface {
  name = 'ChangeUserFriendRequestToManyToOne1588704558442';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_friend_request" DROP CONSTRAINT "FK_0a5c95e13de71cdf1ee45c40812"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user_friend_request" DROP CONSTRAINT "FK_5e528d83eb10b13463b7ca468c8"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user_friend_request" DROP CONSTRAINT "UQ_b7716dbedc42a0e559d32067259"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user_friend_request" DROP CONSTRAINT "UQ_0a5c95e13de71cdf1ee45c40812"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user_friend_request" DROP CONSTRAINT "UQ_5e528d83eb10b13463b7ca468c8"`,
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
    await queryRunner.query(
      `ALTER TABLE "user_friend_request" ADD CONSTRAINT "UQ_5e528d83eb10b13463b7ca468c8" UNIQUE ("toUserInternalUserId")`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user_friend_request" ADD CONSTRAINT "UQ_0a5c95e13de71cdf1ee45c40812" UNIQUE ("fromUserInternalUserId")`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user_friend_request" ADD CONSTRAINT "UQ_b7716dbedc42a0e559d32067259" UNIQUE ("fromUserInternalUserId", "toUserInternalUserId")`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user_friend_request" ADD CONSTRAINT "FK_5e528d83eb10b13463b7ca468c8" FOREIGN KEY ("toUserInternalUserId") REFERENCES "user_account"("internalUserId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user_friend_request" ADD CONSTRAINT "FK_0a5c95e13de71cdf1ee45c40812" FOREIGN KEY ("fromUserInternalUserId") REFERENCES "user_account"("internalUserId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }
}
