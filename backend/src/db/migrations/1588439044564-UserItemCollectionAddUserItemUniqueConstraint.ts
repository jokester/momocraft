import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserItemCollectionAddUserItemUniqueConstraint1588439044564 implements MigrationInterface {
  name = 'UserItemCollectionAddUserItemUniqueConstraint1588439044564';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_item_collection" ADD CONSTRAINT "UQ_bcffa3a3eb49bdb2b4440fee92c" UNIQUE ("userId", "itemId")`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_item_collection" DROP CONSTRAINT "UQ_bcffa3a3eb49bdb2b4440fee92c"`,
      undefined,
    );
  }
}
