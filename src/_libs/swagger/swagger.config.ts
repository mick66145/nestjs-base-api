import { registerAs } from '@nestjs/config';
import { SwaggerConfigInterface } from './swagger-config.interface';

export default registerAs(
  'swagger',
  (): SwaggerConfigInterface => ({
    enabled: process.env.SWAGGER_ENABLED?.toLowerCase() === 'true',
    endpoint: process.env.SWAGGER_ENDPOINT ?? 'docs',
    baseUrl: process.env.SWAGGER_BASE_URL ?? '',
    user: process.env.SWAGGER_USER ?? '',
    password: process.env.SWAGGER_PASSWORD ?? '',
  }),
);
