import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity('users')
export class UserEntity extends BaseEntity {
  // USERNAME
  @ApiProperty({
    example: 'janedoe',
    description: 'Username for login and identification',
  })
  @Column()
  username: string;

  // EMAIL
  @ApiProperty({
    example: 'jane_doe@example.com',
    description: 'Email address of the user',
  })
  @Column({ unique: true })
  email: string;

  // PASSWORD
  @ApiProperty({
    example: 'Password123!',
    description: 'User password (hashed when stored)',
  })
  @Column()
  @Exclude()
  password: string;

  // ROLE
  @ApiProperty({
    description: 'User role for authorization',
    enum: ['user', 'admin'],
    default: 'user',
  })
  @Column({ type: 'varchar', default: 'user' })
  role: string;

  // REFRESH TOKEN
  @ApiProperty({
    description: 'Refresh token for JWT authentication',
    required: false,
  })
  @Column({ nullable: true, type: 'text' })
  @Exclude()
  refreshToken: string;
}
