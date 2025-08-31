import { registerAs } from '@nestjs/config';
import { AppProjectConfigInterface } from './app-project-config.interface';

export default registerAs(
  'app-project',
  (): AppProjectConfigInterface => ({
    externalUrl: process.env.APP_EXTERNAL_URL,
    internalUrl: process.env.APP_INTERNAL_URL,
  }),
);
