import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1745339807797 implements MigrationInterface {
    name = 'InitialSchema1745339807797'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "username" character varying NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "role" character varying NOT NULL DEFAULT 'user',
                "refreshToken" text,
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
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
                "balance" numeric(10, 2) NOT NULL DEFAULT '0',
                CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."transactions_transactiontype_enum" AS ENUM('SALE', 'PAYMENT')
        `);
        await queryRunner.query(`
            CREATE TABLE "transactions" (
                "id" SERIAL NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "transactionType" "public"."transactions_transactiontype_enum" NOT NULL,
                "transactionDate" date NOT NULL,
                "description" character varying NOT NULL,
                "quantity" numeric(10, 2),
                "quantityUnit" character varying(32),
                "unitPrice" numeric(10, 2),
                "totalAmount" numeric(10, 2) NOT NULL DEFAULT '0',
                "receivedAmount" numeric(10, 2) NOT NULL DEFAULT '0',
                "balanceAfterTransaction" numeric(10, 2) NOT NULL DEFAULT '0',
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
        await queryRunner.query(`
            DROP TABLE "customers"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
    }

}
