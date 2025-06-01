import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { SupplierTransactionService } from '../services/supplier-transaction.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilterTransactionsDto } from '../dtos/filter-transactions.dto';
import { SupplierTransactionType } from '../enums/supplier-transaction-type.enum';
import { CreateSupplierTransactionDto } from '../dtos/create-supplier-transaction.dto';
import { UpdateSupplierTransactionDto } from '../dtos/update-supplier-transaction.dto';
import { Roles } from 'src/app/common/decorators/roles.decorator';
import { UserRole } from 'src/app/common/enums/user-role.enum';

@ApiTags('Supplier Transactions')
@ApiBearerAuth('JWT-auth')
@Roles(UserRole.ADMIN)
@Controller('supplier-transactions')
export class SupplierTransactionController {
  constructor(
    private readonly supplierTransactionService: SupplierTransactionService,
  ) {}

  @ApiOperation({ summary: 'Get all transactions for a supplier' })
  @ApiResponse({
    status: 200,
    description: 'List of transactions for the supplier',
  })
  @Get()
  async findAllBySupplierId(@Query() query: FilterTransactionsDto) {
    return await this.supplierTransactionService.findAllBySupplierId(
      query.supplier,
    );
  }

  @ApiBody({
    description: 'Transaction data',
    examples: {
      sale: {
        summary: 'Purchase Transaction',
        value: {
          supplierId: 1,
          transactionType: SupplierTransactionType.PURCHASE,
          transactionDate: '2023-10-01',
          description: 'Purchase of goods',
          quantity: 10,
          quantityUnit: 'pcs',
          unitPrice: 50.0,
          totalAmount: 500.0,
        },
      },
      payment: {
        summary: 'Payment Transaction',
        value: {
          supplierId: 1,
          transactionType: SupplierTransactionType.PAYMENT,
          transactionDate: '2023-10-01',
          description: 'Payment made',
          paidAmount: 500.0,
        },
      },
    },
  })
  @Post()
  async create(
    @Body() createSupplierTransactionDto: CreateSupplierTransactionDto,
  ) {
    return await this.supplierTransactionService.create(
      createSupplierTransactionDto,
    );
  }

  @ApiBody({
    description: 'Transaction data',
    examples: {
      sale: {
        summary: 'Purchase Transaction',
        value: {
          supplierId: 1,
          transactionType: SupplierTransactionType.PURCHASE,
          transactionDate: '2023-10-01',
          description: 'Purchase of goods',
          quantity: 10,
          quantityUnit: 'pcs',
          unitPrice: 50.0,
          totalAmount: 500.0,
        },
      },
      payment: {
        summary: 'Payment Transaction',
        value: {
          supplierId: 1,
          transactionType: SupplierTransactionType.PAYMENT,
          transactionDate: '2023-10-01',
          description: 'Payment made',
          paidAmount: 500.0,
        },
      },
    },
  })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSupplierTransactionDto: UpdateSupplierTransactionDto,
  ) {
    return await this.supplierTransactionService.update(
      id,
      updateSupplierTransactionDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.supplierTransactionService.remove(id);
  }
}
