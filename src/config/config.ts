import { ConfigModuleOptions } from '@nestjs/config';
import { configSchema } from './config-schema';

export const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
  expandVariables: true,
  validationSchema: configSchema,
};
