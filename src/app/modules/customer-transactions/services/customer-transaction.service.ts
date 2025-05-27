import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateCustomerTransactionDto } from '../dtos/create-customer-transaction.dto';
import { CustomerService } from '../../customers/services/customer.service';
import { UpdateCustomerTransactionDto } from '../dtos/update-customer-transaction.dto';
import { CustomerTransactionType } from '../enums/customer-transaction-type.enum';

@Injectable()
export class CustomerTransactionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly customerService: CustomerService,
  ) {}

  async findOneById(id: number) {
    const transaction = await this.prisma.customerTransaction.findUnique({
      where: { id },
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  async findAllByCustomerId(customerId: number) {
    await this.customerService.findOneById(customerId);
    const transactions = await this.prisma.customerTransaction.findMany({
      where: { customerId },
      orderBy: { createdAt: 'asc' },
    });

    let afterBalance = 0;
    const transactionsWithBalance = transactions.map((transaction) => {
      afterBalance =
        transaction.transactionType === CustomerTransactionType.SALE
          ? afterBalance + (transaction.totalAmount ?? 0)
          : afterBalance - (transaction.receivedAmount ?? 0);

      return {
        ...transaction,
        afterBalance,
      };
    });

    return transactionsWithBalance;
  }

  async create(createCustomerTransactionDto: CreateCustomerTransactionDto) {
    const { customerId, ...transactionData } = createCustomerTransactionDto;

    await this.customerService.findOneById(customerId);
    return await this.prisma.customerTransaction.create({
      data: {
        customerId,
        ...transactionData,
      },
    });
  }

  async update(
    id: number,
    updateCustomerTransactionData: UpdateCustomerTransactionDto,
  ) {
    await this.findOneById(id);
    return await this.prisma.customerTransaction.update({
      where: { id },
      data: updateCustomerTransactionData,
    });
  }

  async remove(id: number) {
    await this.findOneById(id);
    return await this.prisma.customerTransaction.delete({
      where: { id },
    });
  }
}
