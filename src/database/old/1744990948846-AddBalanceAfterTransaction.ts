import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBalanceAfterTransaction1744990948846
  implements MigrationInterface
{
  name = 'AddBalanceAfterTransaction1744990948846';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "transactions"
            ADD "balanceAfterTransaction" numeric(10, 2) NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "transactions" DROP COLUMN "balanceAfterTransaction"
        `);
  }
}
