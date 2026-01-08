import { INestApplication, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import basicAuth from 'express-basic-auth';
import { AppConfigInterface } from '../app/app-config.interface';
import { ApiKeyConfigInterface } from '../auth/api-key-config.interface';
import { SwaggerConfigInterface } from './swagger-config.interface';

type SwaggerDocument = {
  name: string;
  version: string;
  path: string;
  module?: Type;
};

type SwaggerMultiDocument = {
  name: string;
  endpoint: string;
  module: Type;
};

function getAppConfig(app: INestApplication) {
  const configService = app.get(ConfigService);
  return configService.getOrThrow<AppConfigInterface>('app');
}

function getSwaggerConfig(app: INestApplication) {
  const configService = app.get(ConfigService);
  return configService.getOrThrow<SwaggerConfigInterface>('swagger');
}

function getApiKeyConfig(app: INestApplication) {
  const configService = app.get(ConfigService);
  return configService.getOrThrow<ApiKeyConfigInterface>('apiKey');
}

function getSwaggerPath(app: INestApplication) {
  const { globalPrefix } = getAppConfig(app);
  const { endpoint } = getSwaggerConfig(app);

  return `${globalPrefix}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
}

function buildDocument(app: INestApplication, info: SwaggerDocument) {
  const { header: apiKeyHeader } = getApiKeyConfig(app);
  const { baseUrl } = getSwaggerConfig(app);
  const { name, version, path, module } = info;

  const builder = new DocumentBuilder()
    .setTitle(name)
    .setVersion(version)
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: apiKeyHeader, in: 'header' }, 'ApiKey');

  if (baseUrl) builder.addServer(baseUrl, 'api_server');
  const config = builder.build();

  const document = SwaggerModule.createDocument(app, config, {
    // Turn on when needing to split documents for modules
    // deepScanRoutes: true,
    // include: [],
    ...(module && {
      deepScanRoutes: true,
      include: [module],
    }),
  });

  SwaggerModule.setup(path, app, document);
}

export function setupSwaggerConfig(app: INestApplication) {
  const { user, password } = getSwaggerConfig(app);

  const path = getSwaggerPath(app);

  if (user.length && password.length) {
    app.use(
      [`${path}`, `${path}-json`],
      basicAuth({ challenge: true, users: { [user]: password } }),
    );
  }
}

export function setupSwaggerDocument(app: INestApplication) {
  const { name, version } = getAppConfig(app);
  const path = getSwaggerPath(app);

  buildDocument(app, {
    name,
    path,
    version,
  });
}

export function setupSwaggerMultiDocument(
  app: INestApplication,
  documents: SwaggerMultiDocument[],
) {
  const { name: appName, version } = getAppConfig(app);
  const { endpoint: swaggerEndpoint } = getSwaggerConfig(app);
  const swaggerPath = getSwaggerPath(app);
  const builder = new DocumentBuilder();
  const config = builder.build();

  SwaggerModule.setup(
    swaggerPath,
    app,
    () => ({
      openapi: config.openapi,
      info: config.info,
      paths: {},
    }),
    {
      explorer: true,
      swaggerOptions: {
        urls: documents.map(({ name, endpoint }) => ({
          name,
          url: `${swaggerEndpoint}/${endpoint}-json`,
        })),
      },
    },
  );

  for (const { name, endpoint, module } of documents) {
    const path = `${swaggerPath}/${endpoint}`;
    buildDocument(app, {
      name: `${appName} - ${name}`,
      path,
      version,
      module,
    });
  }
}
