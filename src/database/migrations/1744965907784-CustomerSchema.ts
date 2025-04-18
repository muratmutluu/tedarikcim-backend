import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustomerSchema1744965907784 implements MigrationInterface {
  name = 'CustomerSchema1744965907784';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "customers" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "companyName" character varying NOT NULL,
                "address" character varying,
                "phone" character varying,
                "email" character varying,
                "taxOffice" character varying,
                "taxNumber" character varying,
                "balance" numeric NOT NULL DEFAULT '0',
                CONSTRAINT "PK_customers" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "customer_entity"
        `);
  }
}
