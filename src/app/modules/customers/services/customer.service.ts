import { Injectable, NotFoundException } from '@nestjs/common';
import { Customer } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneById(id: number): Promise<Customer> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async findAll(): Promise<Customer[]> {
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

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return await this.prisma.customer.create({
      data: createCustomerDto,
    });
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.findOneById(id);
    return await this.prisma.customer.update({
      where: { id: customer.id },
      data: updateCustomerDto,
    });
  }

  async delete(id: number): Promise<Customer> {
    const customer = await this.findOneById(id);
    return await this.prisma.customer.delete({
      where: { id: customer.id },
    });
  }
}
