import { Module } from '@nestjs/common';
import { DashboardController } from './controllers/dashboard.controller';
import { DashboardService } from './services/dashboard.service';

@Module({
  imports: [],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [],
})
export class DashboardModule {}
