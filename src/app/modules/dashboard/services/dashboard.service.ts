import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { format, subDays } from 'date-fns';
import { Prisma } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardData() {
    const [
      totalCustomers,
      totalSuppliers,
      totalInvoices,
      customerTransactionSums,
      supplierTransactionSums,
    ] = await Promise.all([
      this.prisma.customer.count(),
      this.prisma.supplier.count(),
      this.prisma.invoice.count(),
      this.prisma.customerTransaction.aggregate({
        _sum: {
          totalAmount: true,
          receivedAmount: true,
        },
      }),
      this.prisma.supplierTransaction.aggregate({
        _sum: {
          totalAmount: true,
          paidAmount: true,
        },
      }),
    ]);

    return {
      totalCustomers,
      totalSuppliers,
      totalInvoices,
      totalCustomerTransactionAmount:
        customerTransactionSums._sum.totalAmount || 0,
      totalCustomerReceivedAmount:
        customerTransactionSums._sum.receivedAmount || 0,
      totalSupplierTransactionAmount:
        supplierTransactionSums._sum.totalAmount || 0,
      totalSupplierPaidAmount: supplierTransactionSums._sum.paidAmount || 0,
    };
  }

  async getTopCustomersByBalance(limit = 10, order: 'asc' | 'desc' = 'desc') {
    const validOrder = order === 'asc' ? 'asc' : 'desc';
    // Raw SQL ile direkt hesaplama
    return await this.prisma.$queryRaw<
      {
        id: number;
        name: string;
        balance: number;
      }[]
    >`
    SELECT 
      c.id,
      c.name,
      COALESCE(SUM(ct."totalAmount"), 0) - COALESCE(SUM(ct."receivedAmount"), 0) as balance
    FROM "Customer" c
    LEFT JOIN "CustomerTransaction" ct ON c.id = ct."customerId"
    GROUP BY c.id, c.name, c.email, c.phone
    ORDER BY balance ${Prisma.raw(validOrder)}
    LIMIT ${limit}    
  `;
  }

  async getDailyTransactionsTotal(days = 7) {
    const startDate = subDays(new Date(), days);

    const result = await this.prisma.customerTransaction.groupBy({
      by: ['transactionDate'],
      where: {
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

  async getMonthlyTransactionsAverage(year: number) {
    const result = await this.prisma.$queryRaw<
      {
        month: number;
        avgTotalAmount: number | null;
        avgReceivedAmount: number | null;
      }[]
    >`
    SELECT 
      EXTRACT(MONTH FROM "transactionDate")::INT AS "month",
      AVG("totalAmount") AS "avgTotalAmount",
      AVG("receivedAmount") AS "avgReceivedAmount"
    FROM "CustomerTransaction"
    WHERE EXTRACT(YEAR FROM "transactionDate") = ${year}
    GROUP BY EXTRACT(MONTH FROM "transactionDate")
    ORDER BY month
  `;

    return result.map((item) => ({
      month: item.month,
      avgTotalAmount:
        item.avgTotalAmount !== null
          ? Number(item.avgTotalAmount.toFixed(2))
          : 0,
      avgReceivedAmount:
        item.avgReceivedAmount !== null
          ? Number(item.avgReceivedAmount.toFixed(2))
          : 0,
    }));
  }

  async getMonthlyTransactionsTotal(year: number) {
    const result = await this.prisma.$queryRaw<
      {
        month: number;
        totalAmount: number | null;
        receivedAmount: number | null;
      }[]
    >`
    SELECT 
      EXTRACT(MONTH FROM "transactionDate")::INT AS "month",
      SUM("totalAmount") AS "totalAmount",
      SUM("receivedAmount") AS "receivedAmount"
    FROM "CustomerTransaction"
    WHERE EXTRACT(YEAR FROM "transactionDate") = ${year}
    GROUP BY EXTRACT(MONTH FROM "transactionDate")
    ORDER BY month
  `;

    return result.map((item) => ({
      month: item.month,
      totalAmount: item.totalAmount || 0,
      receivedAmount: item.receivedAmount || 0,
    }));
  }
}
