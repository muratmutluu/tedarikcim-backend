import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionSchema1744982994015 implements MigrationInterface {
  name = 'TransactionSchema1744982994015';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."transactions_transactiontype_enum" AS ENUM('INCOME', 'EXPENSE')
        `);
    await queryRunner.query(`
            CREATE TABLE "transactions" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "transactionType" "public"."transactions_transactiontype_enum" NOT NULL,
                "transactionDate" date NOT NULL,
                "description" character varying NOT NULL,
                "quantity" numeric(10, 2) NOT NULL,
                "quantityUnit" character varying(32) NOT NULL,
                "unitPrice" numeric(10, 2) NOT NULL,
                "totalAmount" numeric(10, 2) NOT NULL,
                "receivedAmount" numeric(10, 2) NOT NULL,
                "customerId" integer,
                CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "transactions"
            ADD CONSTRAINT "FK_52a272e6c6a006922bc80d7e197" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "transactions" DROP CONSTRAINT "FK_52a272e6c6a006922bc80d7e197"
        `);
    await queryRunner.query(`
            DROP TABLE "transactions"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."transactions_transactiontype_enum"
        `);
  }
}
