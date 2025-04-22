import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CustomerFindAllResult,
  CustomerService,
} from '../services/customer.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { CustomerEntity } from '../entities/customer.entity';
import { PaginationDto } from 'src/app/common/dto/pagination.dto';

@ApiTags('Customers')
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({
    status: 201,
    description: 'Customer has been successfully created',
  })
  @Post()
  create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerEntity> {
    return this.customerService.create(createCustomerDto);
  }

  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all customers',
  })
  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<CustomerFindAllResult> {
    if (paginationDto.page || paginationDto.pageSize) {
      return this.customerService.findAllWithPagination(paginationDto);
    } else {
      return this.customerService.findAll();
    }
  }

  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the customer with the specified ID',
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @Get(':id')
  findOneById(@Param('id') id: number): Promise<CustomerEntity> {
    return this.customerService.findOneById(id);
  }

  @ApiOperation({ summary: 'Update a customer by ID' })
  @ApiResponse({
    status: 200,
    description: 'Customer has been successfully updated',
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
  })
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerEntity> {
    return this.customerService.update(id, updateCustomerDto);
  }

  @ApiOperation({ summary: 'Delete a customer by ID' })
  @ApiResponse({
    status: 200,
    description: 'Customer has been successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
  })
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.customerService.remove(id);
  }
}
