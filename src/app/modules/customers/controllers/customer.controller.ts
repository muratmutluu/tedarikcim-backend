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
  ParseBoolPipe,
  DefaultValuePipe,
  ForbiddenException,
} from '@nestjs/common';
import { CustomerService } from '../services/customer.service';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/app/common/decorators/roles.decorator';
import { UserRole } from 'src/app/common/enums/user-role.enum';
import { GetUser } from '../../../common/decorators/get-user.decorator';

@ApiTags('Customers')
@ApiBearerAuth('JWT-auth')
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get(':id')
  async findOneById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('role') role?: UserRole,
    @GetUser('customerId') customerId?: number,
    @Query('withBalance', new ParseBoolPipe({ optional: true }))
    withBalance?: boolean,
  ) {
    if (role === UserRole.CUSTOMER && customerId !== id) {
      throw new ForbiddenException('Unauthorized access to customer data');
    }

    if (withBalance) {
      return await this.customerService.findOneByIdWithBalance(id);
    }
    return await this.customerService.findOneById(id);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  async findAll(
    @Query('withBalance', new ParseBoolPipe({ optional: true }))
    withBalance?: boolean,
  ) {
    if (withBalance) {
      return await this.customerService.findAllWithBalance();
    }
    return await this.customerService.findAll();
  }

  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return await this.customerService.create(createCustomerDto);
  }

  @Roles(UserRole.ADMIN)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return await this.customerService.update(id, updateCustomerDto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.customerService.delete(id);
  }

  @Get(':id/stats')
  async getCustomerStats(@Param('id', ParseIntPipe) id: number) {
    return await this.customerService.getCustomerStats(id);
  }

  @Get(':id/stats/daily-transactions-total')
  async getCustomerDailyTransactionsTotal(
    @Param('id', ParseIntPipe) id: number,
    @Query('days', new DefaultValuePipe(7), ParseIntPipe) days: number,
  ) {
    return await this.customerService.getCustomerDailyTransactionsTotal(
      id,
      days,
    );
  }

  @Get(':id/stats/daily-transactions-average')
  async getCustomerDailyTransactionsAverage(
    @Param('id', ParseIntPipe) id: number,
    @Query('days', new DefaultValuePipe(7), ParseIntPipe) days: number,
  ) {
    return await this.customerService.getCustomerDailyTransactionsAverage(
      id,
      days,
    );
  }

  @Get(':id/stats/monthly-transactions-total')
  async getCustomerMonthlyTransactionsTotal(
    @Param('id', ParseIntPipe) id: number,
    @Query('year', new DefaultValuePipe(new Date().getFullYear()), ParseIntPipe)
    year: number,
  ) {
    return await this.customerService.getCustomerMonthlyTransactionsTotal(
      id,
      year,
    );
  }

  @Get(':id/stats/monthly-transactions-average')
  async getCustomerMonthlyTransactionsAverage(
    @Param('id', ParseIntPipe) id: number,
    @Query('year', new DefaultValuePipe(new Date().getFullYear()), ParseIntPipe)
    year: number,
  ) {
    return await this.customerService.getCustomerMonthlyTransactionsAverage(
      id,
      year,
    );
  }
}
