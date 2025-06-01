-- CreateEnum
CREATE TYPE "SupplierTransactionType" AS ENUM ('PURCHASE', 'PAYMENT');

-- CreateTable
CREATE TABLE "Supplier" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "taxOffice" TEXT,
    "taxNumber" TEXT,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierTransaction" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "transactionType" "SupplierTransactionType" NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION,
    "quantityUnit" TEXT,
    "unitPrice" DOUBLE PRECISION,
    "totalAmount" DOUBLE PRECISION,
    "paidAmount" DOUBLE PRECISION,
    "supplierId" INTEGER NOT NULL,

    CONSTRAINT "SupplierTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SupplierTransaction" ADD CONSTRAINT "fk_supplier_transactions" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
