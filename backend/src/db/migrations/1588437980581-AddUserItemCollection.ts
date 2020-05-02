import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserItemCollection1588437980581 implements MigrationInterface {
  name = 'AddUserItemCollection1588437980581';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_item_collection" ("userItemCollectionId" SERIAL NOT NULL, "userId" character varying NOT NULL, "itemId" character varying NOT NULL, "itemState" character varying NOT NULL, CONSTRAINT "PK_68568284bfe2b71e73a3d30b151" PRIMARY KEY ("userItemCollectionId"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_af03938a34f9da87cd198e4143" ON "user_item_collection" ("userId") `,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0f13d57f404e80cf90afa39ff5" ON "user_item_collection" ("itemId") `,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8054205e11dd555dca86d74274" ON "user_item_collection" ("itemState") `,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_8054205e11dd555dca86d74274"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_0f13d57f404e80cf90afa39ff5"`, undefined);
    await queryRunner.query(`DROP INDEX "IDX_af03938a34f9da87cd198e4143"`, undefined);
    await queryRunner.query(`DROP TABLE "user_item_collection"`, undefined);
  }
}
