import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvoiceItemDto {
  @ApiProperty({ example: 'Product A', description: 'Description of the item' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 2, description: 'Quantity of the item' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 50.0, description: 'Unit price of the item' })
  @IsNumber()
  unitPrice: number;

  @ApiProperty({
    example: 100.0,
    description: 'Total price (unitPrice * quantity)',
  })
  @IsNumber()
  totalAmount: number;
}
