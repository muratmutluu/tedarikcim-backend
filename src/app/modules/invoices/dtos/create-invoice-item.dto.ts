import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvoiceItemDto {
  @ApiProperty({ example: 'Product A', description: 'Description of the item' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 2, description: 'Quantity of the item' })
  @IsInt()
  quantity: number;

  @ApiProperty({ example: 50.0, description: 'Unit price of the item' })
  @IsInt()
  unitPrice: number;

  @ApiProperty({
    example: 100.0,
    description: 'Total price (unitPrice * quantity)',
  })
  @IsInt()
  totalAmount: number;
}
