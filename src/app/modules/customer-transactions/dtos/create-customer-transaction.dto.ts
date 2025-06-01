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
import { CustomerTransactionType } from '../enums/customer-transaction-type.enum';
import { Type } from 'class-transformer';
import { IsTransactionFieldsValid } from '../decorators/is-transaction-fields-valid';

export class CreateCustomerTransactionDto {
  @ApiProperty({
    description: 'Customer ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  customerId: number;

  @ApiProperty({
    description: 'Type of the transaction',
    enum: CustomerTransactionType,
  })
  @IsNotEmpty()
  @IsEnum(CustomerTransactionType)
  @IsTransactionFieldsValid()
  transactionType: CustomerTransactionType;

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
    (o: CreateCustomerTransactionDto) =>
      o.transactionType === CustomerTransactionType.SALE,
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
    (o: CreateCustomerTransactionDto) =>
      o.transactionType === CustomerTransactionType.SALE,
  )
  @IsNotEmpty()
  @IsString()
  quantityUnit: string;

  @ApiProperty({
    description: 'Unit price for SALE transactions',
    required: false,
  })
  @ValidateIf(
    (o: CreateCustomerTransactionDto) =>
      o.transactionType === CustomerTransactionType.SALE,
  )
  @IsNotEmpty()
  @IsNumber()
  unitPrice: number;

  @ApiProperty({
    description: 'Total amount for SALE transactions',
    required: false,
  })
  @ValidateIf(
    (o: CreateCustomerTransactionDto) =>
      o.transactionType === CustomerTransactionType.SALE,
  )
  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;

  @ApiProperty({
    description: 'Received amount for PAYMENT transactions',
    required: false,
  })
  @ValidateIf(
    (o: CreateCustomerTransactionDto) =>
      o.transactionType === CustomerTransactionType.PAYMENT,
  )
  @IsNotEmpty()
  @IsNumber()
  receivedAmount: number;
}
