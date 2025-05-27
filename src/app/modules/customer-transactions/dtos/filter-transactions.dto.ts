import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class FilterTransactionsDto {
  @ApiProperty({
    description: 'Customer ID to filter transactions by',
    example: 123,
  })
  @IsNotEmpty({ message: 'Customer ID is required.' })
  @Type(() => Number)
  @IsInt()
  customer: number;
}
