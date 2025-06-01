import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
} from 'class-validator';
import { SupplierTransactionType } from '../enums/supplier-transaction-type.enum';
import { Type } from 'class-transformer';
import { IsTransactionFieldsValid } from '../decorators/is-transaction-fields-valid';

export class CreateSupplierTransactionDto {
  @ApiProperty({
    description: 'Supplier ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  supplierId: number;

  @ApiProperty({
    description: 'Transaction type',
    enum: SupplierTransactionType,
  })
  @IsNotEmpty()
  @IsEnum(SupplierTransactionType)
  @IsTransactionFieldsValid()
  transactionType: SupplierTransactionType;

  @ApiProperty({
    description: 'Date of the transaction',
    example: '2023-10-01',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  transactionDate: Date;

  @ApiProperty({
    description: 'Description of the transaction',
    example: 'Purchase of goods',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Quantity for PURCHASE transactions',
    required: false,
  })
  @ValidateIf(
    (o: CreateSupplierTransactionDto) =>
      o.transactionType === SupplierTransactionType.PURCHASE,
  )
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Unit of measurement for PURCHASE transactions',
    required: false,
  })
  @ValidateIf(
    (o: CreateSupplierTransactionDto) =>
      o.transactionType === SupplierTransactionType.PURCHASE,
  )
  @IsNotEmpty()
  @IsString()
  quantityUnit: string;

  @ApiProperty({
    description: 'Unit price for PURCHASE transactions',
    required: false,
  })
  @ValidateIf(
    (o: CreateSupplierTransactionDto) =>
      o.transactionType === SupplierTransactionType.PURCHASE,
  )
  @IsNotEmpty()
  @IsNumber()
  unitPrice: number;

  @ApiProperty({
    description: 'Total amount for PURCHASE transactions',
    required: false,
  })
  @ValidateIf(
    (o: CreateSupplierTransactionDto) =>
      o.transactionType === SupplierTransactionType.PURCHASE,
  )
  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;

  @ApiProperty({
    description: 'Paid amount for PAYMENT transactions',
    required: false,
  })
  @ValidateIf(
    (o: CreateSupplierTransactionDto) =>
      o.transactionType === SupplierTransactionType.PAYMENT,
  )
  @IsNotEmpty()
  @IsNumber()
  paidAmount: number;
}
