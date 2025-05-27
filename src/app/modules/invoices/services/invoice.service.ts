import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateInvoiceDto } from '../dtos/create-invoice.dto';
import { CustomerService } from '../../customers/services/customer.service';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly customerService: CustomerService,
  ) {}

  async findOneById(id: number) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
            phone: true,
            address: true,
            taxOffice: true,
            taxNumber: true,
          },
        },
        invoiceItems: true,
      },
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  async findAll() {
    return await this.prisma.invoice.findMany({
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        invoiceDate: true,
        invoiceNumber: true,
        description: true,
        totalAmount: true,
        customerId: true,
        customer: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async create(createInvoiceDto: CreateInvoiceDto) {
    const { customerId, invoiceItems, ...invoiceData } = createInvoiceDto;

    await this.customerService.findOneById(customerId);

    const invoice = await this.prisma.invoice.create({
      data: {
        ...invoiceData,
        customerId,
        invoiceItems: {
          create: invoiceItems,
        },
      },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
            phone: true,
            address: true,
            taxOffice: true,
            taxNumber: true,
          },
        },
        invoiceItems: true,
      },
    });

    return invoice;
  }

  async remove(id: number) {
    await this.findOneById(id);
    return await this.prisma.invoice.delete({
      where: { id },
    });
  }
}
