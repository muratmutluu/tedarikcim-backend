/*
  Warnings:

  - You are about to drop the column `taxAmount` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `taxRate` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `InvoiceItem` table. All the data in the column will be lost.
  - Added the required column `totalTaxAmount` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lineTotalAmount` to the `InvoiceItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxAmount` to the `InvoiceItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxRate` to the `InvoiceItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "taxAmount",
DROP COLUMN "taxRate",
ADD COLUMN     "totalTaxAmount" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "InvoiceItem" DROP COLUMN "totalAmount",
ADD COLUMN     "lineTotalAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "taxAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "taxRate" DOUBLE PRECISION NOT NULL;
