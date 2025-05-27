import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CustomerService } from '../services/customer.service';
import { Customer } from '@prisma/client';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Customers')
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get(':id')
  async findOneById(@Param('id', ParseIntPipe) id: number): Promise<Customer> {
    return await this.customerService.findOneById(id);
  }

  @Get()
  async findAll(@Query('withBalance') withBalance?: string) {
    if (withBalance === 'true') {
      return await this.customerService.findAllWithBalance();
    }
    return await this.customerService.findAll();
  }

  @Post()
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    return await this.customerService.create(createCustomerDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return await this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<Customer> {
    return await this.customerService.delete(id);
  }
}
