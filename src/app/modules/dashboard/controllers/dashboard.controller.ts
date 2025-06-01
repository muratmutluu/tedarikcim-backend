import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/app/common/enums/user-role.enum';
import { Roles } from 'src/app/common/decorators/roles.decorator';

@ApiTags('Dashboard')
@ApiBearerAuth('JWT-auth')
@Roles(UserRole.ADMIN)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getDashboardData() {
    return await this.dashboardService.getDashboardData();
  }

  @Get('top-customers-by-balance')
  async getTopCustomersByBalance(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('order', new DefaultValuePipe('desc'))
    order: 'asc' | 'desc' = 'desc',
  ) {
    return await this.dashboardService.getTopCustomersByBalance(limit, order);
  }

  @Get('daily-transactions-total')
  async getDailyTransactionsTotal(
    @Query('days', new DefaultValuePipe(7), ParseIntPipe) days: number,
  ) {
    return await this.dashboardService.getDailyTransactionsTotal(days);
  }
  @Get('monthly-transactions-average')
  async getMonthlyTransactionsAverage(
    @Query('year', new DefaultValuePipe(new Date().getFullYear()), ParseIntPipe)
    year: number,
  ) {
    return await this.dashboardService.getMonthlyTransactionsAverage(year);
  }
}
