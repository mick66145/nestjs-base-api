import { registerAs } from '@nestjs/config';
import { ApiKeyConfigInterface } from './api-key-config.interface';

export default registerAs(
  'apiKey',
  (): ApiKeyConfigInterface => ({
    key: process.env.API_KEY,
    header: process.env.API_KEY_HEADER || 'X-API-KEY',
  }),
);
