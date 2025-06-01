import { Module } from '@nestjs/common';
import { SupplierModule } from '../suppliers/supplier.module';
import { SupplierTransactionController } from './controllers/supplier-transaction.controller';
import { SupplierTransactionService } from './services/supplier-transaction.service';

@Module({
  imports: [SupplierModule],
  controllers: [SupplierTransactionController],
  providers: [SupplierTransactionService],
  exports: [],
})
export class SupplierTransactionModule {}
