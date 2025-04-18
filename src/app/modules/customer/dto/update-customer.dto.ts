import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateCustomerDto {
  @ApiProperty({
    example: "Murat's Company",
    description: 'Company name of the customer',
  })
  @IsString({ message: 'Company name must be a string' })
  @IsOptional()
  @Transform(({ value }: { value: string }) => value.trim())
  companyName?: string;

  @ApiProperty({
    example: '123 Main Street, Istanbul',
    description: 'Address of the customer',
    required: false,
  })
  @IsOptional()
  address?: string;

  @ApiProperty({
    example: '+90 555 555 5555',
    description: 'Phone number of the customer',
    required: false,
  })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: 'customer@example.com',
    description: 'Email address of the customer',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'Istanbul Tax Office',
    description: 'Tax office of the customer',
    required: false,
  })
  @IsOptional()
  taxOffice?: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Tax number of the customer',
    required: false,
  })
  @IsOptional()
  taxNumber?: string;
}
