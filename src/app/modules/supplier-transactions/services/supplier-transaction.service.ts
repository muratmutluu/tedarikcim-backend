import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { SupplierService } from '../../suppliers/services/supplier.service';
import { SupplierTransactionType } from '../enums/supplier-transaction-type.enum';
import { CreateSupplierTransactionDto } from '../dtos/create-supplier-transaction.dto';
import { UpdateSupplierTransactionDto } from '../dtos/update-supplier-transaction.dto';

@Injectable()
export class SupplierTransactionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supplierService: SupplierService,
  ) {}

  async findOneById(id: number) {
    const transaction = await this.prisma.supplierTransaction.findUnique({
      where: { id },
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  async findAllBySupplierId(supplierId: number) {
    const supplier =
      await this.supplierService.findOneByIdWithBalance(supplierId);
    const transactions = await this.prisma.supplierTransaction.findMany({
      where: { supplierId },
      orderBy: { createdAt: 'asc' },
    });

    let afterBalance = 0;
    const transactionsWithBalance = transactions.map((transaction) => {
      afterBalance =
        transaction.transactionType === SupplierTransactionType.PURCHASE
          ? afterBalance + (transaction.totalAmount ?? 0)
          : afterBalance - (transaction.paidAmount ?? 0);

      return {
        ...transaction,
        afterBalance,
      };
    });

    return {
      supplier,
      transactions: transactionsWithBalance,
    };
  }

  async create(createSupplierTransactionDto: CreateSupplierTransactionDto) {
    const { supplierId, ...transactionData } = createSupplierTransactionDto;

    await this.supplierService.findOneById(supplierId);
    return await this.prisma.supplierTransaction.create({
      data: {
        supplierId,
        ...transactionData,
      },
    });
  }

  async update(
    id: number,
    updateSupplierTransactionDto: UpdateSupplierTransactionDto,
  ) {
    const transaction = await this.findOneById(id);
    const updatedTransaction = await this.prisma.supplierTransaction.update({
      where: { id: transaction.id },
      data: updateSupplierTransactionDto,
    });
    return updatedTransaction;
  }

  async remove(id: number) {
    const transaction = await this.findOneById(id);
    return await this.prisma.supplierTransaction.delete({
      where: { id: transaction.id },
    });
  }
}
