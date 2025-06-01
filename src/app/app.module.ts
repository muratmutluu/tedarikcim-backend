import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { configModuleOptions } from 'src/config/config';
import { PrismaModule } from 'src/database/prisma.module';
import { CustomerModule } from './modules/customers/customer.module';
import { InvoiceModule } from './modules/invoices/invoice.module';
import { CustomerTransactionModule } from './modules/customer-transactions/customer-transaction.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { SupplierModule } from './modules/suppliers/supplier.module';
import { SupplierTransactionModule } from './modules/supplier-transactions/supplier-transaction.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    PrismaModule,
    CustomerModule,
    CustomerTransactionModule,
    SupplierModule,
    SupplierTransactionModule,
    InvoiceModule,
    DashboardModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
