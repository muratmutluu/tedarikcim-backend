import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  ValidateIf,
} from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';
import { IsTransactionFieldsValid } from '../decorators/is-transaction-fields-valid';

export class UpdateTransactionDto {
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
  @IsOptional()
  @IsDateString()
  transactionDate: string;

  @ApiProperty({
    description: 'Description of the transaction',
    example: 'Sale of goods',
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Quantity for SALE transactions',
    required: false,
  })
  @ValidateIf(
    (o: UpdateTransactionDto) => o.transactionType === TransactionType.SALE,
  )
  @IsOptional()
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Unit of measurement for SALE transactions',
    required: false,
    example: 'pcs',
  })
  @ValidateIf(
    (o: UpdateTransactionDto) => o.transactionType === TransactionType.SALE,
  )
  @IsOptional()
  @IsString()
  quantityUnit: string;

  @ApiProperty({
    description: 'Unit price for SALE transactions',
    required: false,
  })
  @ValidateIf(
    (o: UpdateTransactionDto) => o.transactionType === TransactionType.SALE,
  )
  @IsOptional()
  @IsNumber()
  unitPrice: number;

  @ApiProperty({
    description: 'Received amount for PAYMENT transactions',
    required: false,
  })
  @ValidateIf(
    (o: UpdateTransactionDto) => o.transactionType === TransactionType.PAYMENT,
  )
  @IsOptional()
  @IsNumber()
  receivedAmount: number;
}
