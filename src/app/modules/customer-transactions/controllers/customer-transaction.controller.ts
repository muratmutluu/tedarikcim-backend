import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilterTransactionsDto } from '../dtos/filter-transactions.dto';
import { UpdateCustomerTransactionDto } from '../dtos/update-customer-transaction.dto';
import { Roles } from 'src/app/common/decorators/roles.decorator';
import { UserRole } from 'src/app/common/enums/user-role.enum';
import { GetUser } from 'src/app/common/decorators/get-user.decorator';

@ApiTags('Customer Transactions')
@ApiBearerAuth('JWT-auth')
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
  async findAllByCustomerId(
    @Query() query: FilterTransactionsDto,
    @GetUser('role') role: UserRole,
    @GetUser('customerId') customerId: number,
  ) {
    if (role === UserRole.CUSTOMER && customerId !== query.customer) {
      throw new ForbiddenException(
        'Unauthorized access to customer transactions',
      );
    }

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
  @Roles(UserRole.ADMIN)
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
  @Roles(UserRole.ADMIN)
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
  @Roles(UserRole.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.customerTransactionService.remove(id);
  }
}
