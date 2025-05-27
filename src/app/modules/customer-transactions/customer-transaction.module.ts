import { Module } from '@nestjs/common';
import { CustomerModule } from '../customers/customer.module';
import { CustomerTransactionController } from './controllers/customer-transaction.controller';
import { CustomerTransactionService } from './services/customer-transaction.service';

@Module({
  imports: [CustomerModule],
  controllers: [CustomerTransactionController],
  providers: [CustomerTransactionService],
  exports: [],
})
export class CustomerTransactionModule {}
