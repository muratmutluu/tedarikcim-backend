import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from '../config/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleAsyncOptions } from 'src/database/data-source';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    TypeOrmModule.forRootAsync(typeOrmModuleAsyncOptions),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
