import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsString,
  IsDateString,
  ValidateIf,
} from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';
import { IsTransactionFieldsValid } from '../decorators/is-transaction-fields-valid';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Customer ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  customerId: number;

  @ApiProperty({
    description: 'Type of the transaction',
    enum: TransactionType,
  })
  @IsNotEmpty()
  @IsEnum(TransactionType)
  @IsTransactionFieldsValid()
  transactionType: TransactionType;

  @ApiProperty({
    description: 'Date of the transaction',
    example: '2023-10-01',
  })
  @IsNotEmpty()
  @IsDateString()
  transactionDate: string;

  @ApiProperty({
    description: 'Description of the transaction',
    example: 'Sale of goods',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Quantity for SALE transactions',
    required: false,
  })
  @ValidateIf(
    (o: CreateTransactionDto) => o.transactionType === TransactionType.SALE,
  )
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Unit of measurement for SALE transactions',
    required: false,
    example: 'pcs',
  })
  @ValidateIf(
    (o: CreateTransactionDto) => o.transactionType === TransactionType.SALE,
  )
  @IsNotEmpty()
  @IsString()
  quantityUnit: string;

  @ApiProperty({
    description: 'Unit price for SALE transactions',
    required: false,
  })
  @ValidateIf(
    (o: CreateTransactionDto) => o.transactionType === TransactionType.SALE,
  )
  @IsNotEmpty()
  @IsNumber()
  unitPrice: number;

  @ApiProperty({
    description: 'Received amount for PAYMENT transactions',
    required: false,
  })
  @ValidateIf(
    (o: CreateTransactionDto) => o.transactionType === TransactionType.PAYMENT,
  )
  @IsNotEmpty()
  @IsNumber()
  receivedAmount: number;
}
