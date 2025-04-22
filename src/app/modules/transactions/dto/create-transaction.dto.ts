import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '../entities/transaction.entity';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({
    example: '1',
    description: 'Customer ID associated with the transaction',
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
  transactionType: TransactionType;

  @ApiProperty({
    example: '2023-10-01',
    description: 'Date of the transaction',
  })
  @IsNotEmpty()
  @IsDateString()
  transactionDate: Date;

  @ApiProperty({
    example: 'Payment for services rendered',
    description: 'Description of the transaction',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiPropertyOptional({
    example: 1000.5,
    description:
      'Quantity of the item or service (Required for SALE transactions)',
  })
  @IsNumber()
  @ValidateIf(
    (o: CreateTransactionDto) => o.transactionType === TransactionType.SALE,
  )
  @IsNotEmpty()
  @IsOptional()
  quantity?: number;

  @ApiPropertyOptional({
    example: 'pcs',
    description:
      'Unit of measurement for the quantity (Required for SALE transactions)',
  })
  @IsString()
  @ValidateIf(
    (o: CreateTransactionDto) => o.transactionType === TransactionType.SALE,
  )
  @IsNotEmpty()
  @IsOptional()
  quantityUnit?: string;

  @ApiPropertyOptional({
    example: 50.0,
    description:
      'Price per unit of the item or service (Required for SALE transactions)',
  })
  @IsNumber()
  @ValidateIf(
    (o: CreateTransactionDto) => o.transactionType === TransactionType.SALE,
  )
  @IsNotEmpty()
  @IsOptional()
  unitPrice?: number;

  @ApiPropertyOptional({
    example: 50000.0,
    description:
      'Amount received from the customer (Required for PAYMENT transactions)',
  })
  @ValidateIf(
    (o: CreateTransactionDto) => o.transactionType === TransactionType.PAYMENT,
  )
  @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  receivedAmount?: number;
}
