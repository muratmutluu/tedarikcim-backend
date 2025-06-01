import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class FilterTransactionsDto {
  @ApiProperty({
    description: 'Supplier ID to filter transactions by',
    example: 123,
  })
  @IsNotEmpty({ message: 'Supplier ID is required.' })
  @Type(() => Number)
  @IsInt()
  supplier: number;
}
