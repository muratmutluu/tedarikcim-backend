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
import { CustomerTransactionService } from '../services/customer-transaction.service';
import { CreateCustomerTransactionDto } from '../dtos/create-customer-transaction.dto';
import { CustomerTransactionType } from '../enums/customer-transaction-type.enum';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FilterTransactionsDto } from '../dtos/filter-transactions.dto';
import { UpdateCustomerTransactionDto } from '../dtos/update-customer-transaction.dto';

@Controller('customer-transactions')
export class CustomerTransactionController {
  constructor(
    private readonly customerTransactionService: CustomerTransactionService,
  ) {}

  @ApiOperation({ summary: 'Get all transactions for a customer' })
  @ApiResponse({
    status: 200,
    description: 'List of transactions for the customer',
  })
  @Get()
  async findAllByCustomerId(@Query() query: FilterTransactionsDto) {
    return await this.customerTransactionService.findAllByCustomerId(
      query.customer,
    );
  }

  @ApiBody({
    description: 'Transaction data',
    examples: {
      sale: {
        summary: 'Sale Transaction',
        value: {
          customerId: 1,
          transactionType: CustomerTransactionType.SALE,
          transactionDate: '2023-10-01',
          description: 'Sale of goods',
          quantity: 10,
          quantityUnit: 'pcs',
          unitPrice: 50.0,
          totalAmount: 500.0,
        },
      },
      payment: {
        summary: 'Payment Transaction',
        value: {
          customerId: 1,
          transactionType: CustomerTransactionType.PAYMENT,
          transactionDate: '2023-10-01',
          description: 'Payment received',
          receivedAmount: 500.0,
        },
      },
    },
  })
  @Post()
  async create(
    @Body() createCustomerTransactionDto: CreateCustomerTransactionDto,
  ) {
    return await this.customerTransactionService.create(
      createCustomerTransactionDto,
    );
  }

  @ApiBody({
    description: 'Transaction data',
    examples: {
      sale: {
        summary: 'Sale Transaction',
        value: {
          customerId: 1,
          transactionType: CustomerTransactionType.SALE,
          transactionDate: '2023-10-01',
          description: 'Sale of goods',
          quantity: 10,
          quantityUnit: 'pcs',
          unitPrice: 50.0,
          totalAmount: 500.0,
        },
      },
      payment: {
        summary: 'Payment Transaction',
        value: {
          customerId: 1,
          transactionType: CustomerTransactionType.PAYMENT,
          transactionDate: '2023-10-01',
          description: 'Payment received',
          receivedAmount: 500.0,
        },
      },
    },
  })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerTransactionData: UpdateCustomerTransactionDto,
  ) {
    return await this.customerTransactionService.update(
      id,
      updateCustomerTransactionData,
    );
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.customerTransactionService.remove(id);
  }
}
