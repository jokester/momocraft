import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserItemCollectionAddDate1588689405879 implements MigrationInterface {
  name = 'UserItemCollectionAddDate1588689405879';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_item_collection" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user_item_collection" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_item_collection" DROP COLUMN "updatedAt"`, undefined);
    await queryRunner.query(`ALTER TABLE "user_item_collection" DROP COLUMN "createdAt"`, undefined);
  }
}
