import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';
import { join } from 'path';

/**
 * TypeORM configuration for NestJS module
 * Uses ConfigService to load database settings from environment
 */
export const typeOrmModuleAsyncOptions: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    url: configService.get<string>('DATABASE_URL'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: configService.get<string>('NODE_ENV') === 'development',
    logging: configService.get<string>('NODE_ENV') === 'development',
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    migrationsRun: false,
  }),
};

/**
 * TypeORM data source options for CLI commands
 * Used for migrations and other TypeORM CLI operations
 */
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  entities: [join(__dirname, '/../**/*.entity.{ts,.js}')],
  migrations: [join(__dirname, '../database/migrations/*{.ts,.js}')],
  synchronize: false, // Should be false in production
  logging: process.env.NODE_ENV === 'development',
};

// Data source instance for TypeORM CLI
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
