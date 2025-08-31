import { Inject, Injectable, LogLevel } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { BaseLoggerService } from './base-logger.service';
import { ConfigService } from '@nestjs/config';
import { LoggerConfigServiceInterface } from './logger-config.interface';

@Injectable()
export class PrismaLoggerService extends BaseLoggerService {
  @Inject()
  private configService!: ConfigService;

  constructor(context?: string) {
    super(context ?? 'PrismaLogger');
  }

  onModuleInit(): void {
    const loggerConfig =
      this.configService.getOrThrow<LoggerConfigServiceInterface>(
        'logger.prisma',
      );

    const logger = WinstonModule.createLogger({
      transports: [
        BaseLoggerService.createWinstonFileTransport({
          level: loggerConfig.level as LogLevel,
          filename: 'prisma-log-%DATE%.log',
          maxSize: loggerConfig.maxSize,
          maxFiles: loggerConfig.maxFiles,
          silent: loggerConfig.fileSilent,
        }),
        BaseLoggerService.createWinstonConsoleTransport({
          level: loggerConfig.level as LogLevel,
          silent: loggerConfig.consoleSilent,
        }),
      ],
    });

    this.setLogger(logger);
  }
}
