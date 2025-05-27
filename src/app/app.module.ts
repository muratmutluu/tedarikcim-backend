import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { configModuleOptions } from 'src/config/config';
import { PrismaModule } from 'src/database/prisma.module';
import { CustomerModule } from './modules/customers/customer.module';
import { InvoiceModule } from './modules/invoices/invoice.module';
import { CustomerTransactionModule } from './modules/customer-transactions/customer-transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    PrismaModule,
    CustomerModule,
    InvoiceModule,
    CustomerTransactionModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  ],
})
export class AppModule {}
