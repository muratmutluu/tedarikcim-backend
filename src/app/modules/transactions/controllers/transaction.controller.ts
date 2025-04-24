import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  TransactionEntity,
  TransactionType,
} from '../entities/transaction.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiBody({
    description: 'Transaction data',
    examples: {
      sale: {
        summary: 'Sale Transaction',
        value: {
          customerId: 1,
          transactionType: TransactionType.SALE,
          transactionDate: '2023-10-01',
          description: 'Sale of goods',
          quantity: 10,
          quantityUnit: 'pcs',
          unitPrice: 50.0,
        },
      },
      payment: {
        summary: 'Payment Transaction',
        value: {
          customerId: 1,
          transactionType: TransactionType.PAYMENT,
          transactionDate: '2023-10-01',
          description: 'Payment received',
          receivedAmount: 500.0,
        },
      },
    },
  })
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionEntity> {
    return this.transactionService.create(createTransactionDto);
  }

  @Put(':id')
  @ApiBody({
    description: 'Transaction data',
    examples: {
      sale: {
        summary: 'Sale Transaction',
        value: {
          customerId: 1,
          transactionType: TransactionType.SALE,
          transactionDate: '2023-10-01',
          description: 'Sale of goods',
          quantity: 10,
          quantityUnit: 'pcs',
          unitPrice: 50.0,
        },
      },
      payment: {
        summary: 'Payment Transaction',
        value: {
          customerId: 1,
          transactionType: TransactionType.PAYMENT,
          transactionDate: '2023-10-01',
          description: 'Payment received',
          receivedAmount: 500.0,
        },
      },
    },
  })
  async update(
    @Param('id') id: number,
    @Body() UpdateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(id, UpdateTransactionDto);
  }
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.transactionService.remove(id);
  }

  @ApiOperation({ summary: 'Get a transaction by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the transaction with the specified ID',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @Get(':id')
  findOneById(@Param('id') id: number): Promise<TransactionEntity> {
    return this.transactionService.findOneById(id);
  }

  @ApiOperation({ summary: 'Get transactions by customer ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the all transactions with the specified ID',
  })
  @Get('customer/:customerId')
  async findByCustomer(@Param('customerId') customerId: number) {
    return this.transactionService.findByCustomer(customerId);
  }
}
