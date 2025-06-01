import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'janedoe',
    description: 'Username for the account',
  })
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  username: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'User password (8-50 characters)',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(50, { message: 'Password cannot exceed 50 characters' })
  password: string;

  @ApiProperty({
    example: 1,
    description: 'ID of the associated customer (required if role is CUSTOMER)',
  })
  @IsNumber({}, { message: 'Customer ID must be a number' })
  @IsNotEmpty({ message: 'Customer ID is required' })
  customerId: number;
}
