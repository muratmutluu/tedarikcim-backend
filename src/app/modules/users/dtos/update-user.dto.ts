import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    required: false,
    example: 'janedoe',
    description: 'Username for the account',
  })
  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  username?: string;

  @ApiProperty({
    required: false,
    example: 'StrongPassword123!',
    description: 'User password (8-50 characters)',
  })
  @IsOptional()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(50, { message: 'Password cannot exceed 50 characters' })
  password?: string;
}
