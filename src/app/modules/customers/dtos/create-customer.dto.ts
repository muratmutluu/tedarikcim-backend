import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({
    example: "Murat's Company",
    description: 'Company name of the customer',
  })
  @IsString({ message: 'Company name must be a string' })
  @IsNotEmpty({ message: 'Company name is required' })
  @Transform(({ value }: { value: string }) => value.trim())
  name: string;

  @ApiProperty({
    example: '123 Main Street, Istanbul',
    description: 'Address of the customer',
    required: false,
  })
  @IsString({ message: 'Address must be a string' })
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
  @ValidateIf((o: CreateCustomerDto) => o.email !== '')
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'Istanbul Tax Office',
    description: 'Tax office of the customer',
    required: false,
  })
  @IsString({ message: 'Tax office must be a string' })
  @IsOptional()
  taxOffice?: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Tax number of the customer',
    required: false,
  })
  @IsString({ message: 'Tax number must be a string' })
  @IsOptional()
  taxNumber?: string;
}
