import {
  IsString,
  ValidateNested,
  IsArray,
  IsInt,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateInvoiceItemDto } from './create-invoice-item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvoiceDto {
  @ApiProperty({
    example: 1,
    description: 'Customer ID',
  })
  @IsInt()
  customerId: number;

  @ApiProperty({ example: 'INV-2025001', description: 'Invoice number' })
  @IsString()
  invoiceNumber: string;

  @ApiProperty({
    example: '2025-05-21',
    description: 'Invoice date in ISO format',
  })
  @IsDate()
  @Type(() => Date)
  invoiceDate: Date;

  @ApiProperty({
    example: 'PRODUCT-A',
    description: 'Invoice description',
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 1000.0, description: 'Subtotal amount' })
  @IsInt()
  subTotalAmount: number;

  @ApiProperty({ example: 180.0, description: 'Tax rate' })
  @IsInt()
  taxRate: number;

  @ApiProperty({ example: 180.0, description: 'Tax amount' })
  @IsInt()
  taxAmount: number;

  @ApiProperty({ example: 1180.0, description: 'Total amount including tax' })
  @IsInt()
  @Type(() => Number)
  totalAmount: number;

  @ApiProperty({
    type: [CreateInvoiceItemDto],
    description: 'List of invoice items',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  invoiceItems: CreateInvoiceItemDto[];
}
