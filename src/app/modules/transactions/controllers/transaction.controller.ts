import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionEntity } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Transaction successfully created.',
    type: TransactionEntity,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionEntity> {
    return this.transactionService.create(createTransactionDto);
  }

  @ApiOperation({ summary: 'Get transactions by customer ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of transactions for the specified customer.',
    type: TransactionEntity,
    isArray: true,
  })
  @Get('customer/:customerId')
  async findByCustomer(@Param('customerId') customerId: number) {
    return this.transactionService.findByCustomer(customerId);
  }
}
