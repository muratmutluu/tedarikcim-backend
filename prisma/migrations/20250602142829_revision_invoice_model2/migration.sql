/*
  Warnings:

  - Added the required column `lineSubTotalAmount` to the `InvoiceItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InvoiceItem" ADD COLUMN     "lineSubTotalAmount" DOUBLE PRECISION NOT NULL;
