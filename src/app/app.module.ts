import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from '../config/config';

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions)],
  controllers: [],
  providers: [],
})
export class AppModule {}
