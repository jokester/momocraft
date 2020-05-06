import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserItemCollectionChangeStateToNumber1588793120458 implements MigrationInterface {
  name = 'UserItemCollectionChangeStateToNumber1588793120458';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_8054205e11dd555dca86d74274"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_item_collection" DROP COLUMN "itemState"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_item_collection" ADD "itemState" integer NOT NULL DEFAULT 0`, undefined);
    await queryRunner.query(
      `CREATE INDEX "IDX_8054205e11dd555dca86d74274" ON "user_item_collection" ("itemState") `,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_8054205e11dd555dca86d74274"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_item_collection" DROP COLUMN "itemState"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_item_collection" ADD "itemState" character varying NOT NULL`, undefined);
    await queryRunner.query(
      `CREATE INDEX "IDX_8054205e11dd555dca86d74274" ON "user_item_collection" ("itemState") `,
      undefined,
    );
  }
}
