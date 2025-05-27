import { Module } from '@nestjs/common';
import { InvoiceService } from './services/invoice.service';
import { InvoiceController } from './controllers/invoice.controller';
import { CustomerModule } from '../customers/customer.module';

@Module({
  imports: [CustomerModule],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [],
})
export class InvoiceModule {}
