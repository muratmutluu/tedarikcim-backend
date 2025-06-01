import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'password should be', minimum: 6, maximum: 30 })
  @IsNotEmpty()
  @MinLength(8, { message: 'password should be minimum 8 ' })
  @MaxLength(50, { message: 'password should be maximum 50 ' })
  password: string;
}
