import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvoiceItemDto {
  @ApiProperty({ example: 'Product A', description: 'Description of the item' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 10, description: 'Quantity of the item' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 100.0, description: 'Unit price of the item' })
  @IsNumber()
  unitPrice: number;

  @ApiProperty({
    example: 1000.0,
    description: 'Total without tax (unitPrice * quantity)',
  })
  @IsNumber()
  lineSubTotalAmount: number;

  @ApiProperty({
    example: 0.18,
    description: 'Tax rate as a decimal (e.g., 0.18 for 18%)',
  })
  @IsNumber()
  taxRate: number;

  @ApiProperty({
    example: 180.0,
    description: 'Tax amount calculated from lineTotal and taxRate',
  })
  @IsNumber()
  taxAmount: number;

  @ApiProperty({
    example: 1180.0,
    description: 'Total with tax (unitPrice * quantity + taxAmount)',
  })
  @IsNumber()
  lineTotalAmount: number;
}
