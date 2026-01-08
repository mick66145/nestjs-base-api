import { NestFactory, Reflector } from '@nestjs/core';
import {
  ValidationPipe,
  ClassSerializerInterceptor,
  INestApplication,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SystemLoggerService } from './_libs/logger/system-logger.service';
import { AppConfigInterface } from './_libs/app/app-config.interface';
import { SwaggerConfigInterface } from './_libs/swagger/swagger-config.interface';
import {
  setupSwaggerConfig,
  setupSwaggerDocument,
} from './_libs/swagger/swagger-setup';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // rawBody: true, // ref: https://docs.nestjs.com/faq/raw-body
    bufferLogs: true, // ref: https://docs.nestjs.com/techniques/logger
  });

  // 提供靜態檔案服務
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });

  setupApp(app);
  setupSwagger(app);

  const configService = app.get(ConfigService);
  const appConfig = configService.getOrThrow<AppConfigInterface>('app');
  await app.listen(appConfig.port);

  console.log(`app config:`, appConfig);
  console.log(
    `swagger config:`,
    configService.getOrThrow<SwaggerConfigInterface>('swagger'),
  );
}

function setupApp(app: INestApplication) {
  app.useLogger(app.get(SystemLoggerService));

  app.enableShutdownHooks();
  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
    exposedHeaders: '*',
  });

  const configService = app.get(ConfigService);
  const { globalPrefix } = configService.getOrThrow<AppConfigInterface>('app');
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      // forbidNonWhitelisted: true,
      // transformOptions: { enableImplicitConversion: true },
    }),
  );

  // apply transform to all responses
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
}

function setupSwagger(app: INestApplication) {
  const configService = app.get(ConfigService);
  const swaggerConfig =
    configService.getOrThrow<SwaggerConfigInterface>('swagger');
  if (!swaggerConfig.enabled) return;

  // 配置Swagger基礎設定
  setupSwaggerConfig(app);

  // 配置Swagger API文件
  setupSwaggerDocument(app);
}

bootstrap();
