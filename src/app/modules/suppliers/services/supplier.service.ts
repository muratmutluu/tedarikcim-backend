import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateSupplierDto } from '../dtos/create-supplier.dto';
import { UpdateSupplierDto } from '../dtos/update-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneById(id: number) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
    });
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }
    return supplier;
  }

  async findAll() {
    return await this.prisma.supplier.findMany();
  }

  async findOneByIdWithBalance(id: number) {
    const supplier = await this.findOneById(id);

    const balanceData = await this.prisma.supplierTransaction.aggregate({
      where: { supplierId: id },
      _sum: {
        totalAmount: true,
        paidAmount: true,
      },
    });

    const balance =
      (balanceData._sum.totalAmount || 0) - (balanceData._sum.paidAmount || 0);

    return {
      ...supplier,
      balance,
    };
  }

  async findAllWithBalance() {
    const suppliers = await this.prisma.supplier.findMany();
    const balances = await this.prisma.supplierTransaction.groupBy({
      by: ['supplierId'],
      _sum: {
        totalAmount: true,
        paidAmount: true,
      },
    });

    return suppliers.map((supplier) => {
      const supplierBalance = balances.find(
        (b) => b.supplierId === supplier.id,
      );
      const balance = supplierBalance
        ? (supplierBalance._sum.totalAmount || 0) -
          (supplierBalance._sum.paidAmount || 0)
        : 0;

      return {
        ...supplier,
        balance,
      };
    });
  }

  async create(createSupplierDto: CreateSupplierDto) {
    return await this.prisma.supplier.create({
      data: createSupplierDto,
    });
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto) {
    const supplier = await this.findOneById(id);
    return await this.prisma.supplier.update({
      where: { id: supplier.id },
      data: updateSupplierDto,
    });
  }

  async delete(id: number) {
    const supplier = await this.findOneById(id);
    return await this.prisma.supplier.delete({
      where: { id: supplier.id },
    });
  }
}
