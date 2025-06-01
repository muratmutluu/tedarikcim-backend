import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existisingUser = await this.prisma.user.findUnique({
      where: { username: createUserDto.username },
    });

    if (existisingUser) {
      throw new NotFoundException(
        `User with username ${createUserDto.username} already exists`,
      );
    }

    const existingCustomer = await this.prisma.customer.findUnique({
      where: { id: createUserDto.customerId },
    });

    if (!existingCustomer) {
      throw new NotFoundException(
        `Customer with ID ${createUserDto.customerId} does not exist`,
      );
    }

    const hashedPassword = await this.hashPassword(createUserDto.password);
    createUserDto.password = hashedPassword;

    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findOneById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findOneByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    const user = await this.findOneById(userId);
    return this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async removeRefreshToken(userId: number) {
    const user = await this.findOneById(userId);
    return this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: null },
    });
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
