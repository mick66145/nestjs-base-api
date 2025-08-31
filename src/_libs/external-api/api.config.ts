import { registerAs } from '@nestjs/config';
import { ApiConfig } from './api-config.interface';

export default registerAs(
  'api',
  (): ApiConfig => ({
    iam: {
      apiKeyHeader: process.env.IAM_API_KEY_HEADER || 'X-API-KEY',
      apiKey: process.env.IAM_API_KEY,
      baseUrl: process.env.IAM_API_BASE_URL,
    },
  }),
);
