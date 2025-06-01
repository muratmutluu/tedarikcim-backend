import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { format, subDays } from 'date-fns';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneById(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async findOneByIdWithBalance(id: number) {
    const customer = await this.findOneById(id);

    const balanceData = await this.prisma.customerTransaction.aggregate({
      where: { customerId: id },
      _sum: {
        totalAmount: true,
        receivedAmount: true,
      },
    });

    const balance =
      (balanceData._sum.totalAmount || 0) -
      (balanceData._sum.receivedAmount || 0);

    return {
      ...customer,
      balance,
    };
  }

  async findAll() {
    return await this.prisma.customer.findMany();
  }

  async findAllWithBalance() {
    const customers = await this.prisma.customer.findMany();
    const balances = await this.prisma.customerTransaction.groupBy({
      by: ['customerId'],
      _sum: {
        totalAmount: true,
        receivedAmount: true,
      },
    });

    return customers.map((customer) => {
      const customerBalance = balances.find(
        (b) => b.customerId === customer.id,
      );
      const balance = customerBalance
        ? (customerBalance._sum.totalAmount || 0) -
          (customerBalance._sum.receivedAmount || 0)
        : 0;

      return {
        ...customer,
        balance,
      };
    });
  }

  async create(createCustomerDto: CreateCustomerDto) {
    return await this.prisma.customer.create({
      data: createCustomerDto,
    });
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.findOneById(id);
    return await this.prisma.customer.update({
      where: { id: customer.id },
      data: updateCustomerDto,
    });
  }

  async delete(id: number) {
    const customer = await this.findOneById(id);
    return await this.prisma.customer.delete({
      where: { id: customer.id },
    });
  }

  /*  Customer and Transactions Statistics */
  async getCustomerStats(customerId: number) {
    const [transactionAggregate, transactionCount, invoiceCount] =
      await Promise.all([
        this.prisma.customerTransaction.aggregate({
          where: { customerId },
          _sum: {
            totalAmount: true,
            receivedAmount: true,
          },
        }),
        this.prisma.customerTransaction.count({
          where: { customerId },
        }),
        this.prisma.invoice.count({
          where: { customerId },
        }),
      ]);

    const total = transactionAggregate._sum.totalAmount || 0;
    const received = transactionAggregate._sum.receivedAmount || 0;

    return {
      totalTransactionCount: transactionCount,
      totalInvoiceCount: invoiceCount,
      totalAmount: total,
      receivedAmount: received,
    };
  }

  async getCustomerDailyTransactionsTotal(customerId: number, days = 7) {
    const startDate = subDays(new Date(), days);

    const result = await this.prisma.customerTransaction.groupBy({
      by: ['transactionDate'],
      where: {
        customerId,
        transactionDate: {
          gte: startDate,
        },
      },
      _sum: {
        totalAmount: true,
        receivedAmount: true,
      },
      orderBy: {
        transactionDate: 'asc',
      },
    });

    return result.map((item) => ({
      transactionDate: format(item.transactionDate, 'yyyy-MM-dd'),
      totalAmount: item._sum.totalAmount || 0,
      receivedAmount: item._sum.receivedAmount || 0,
    }));
  }
}
