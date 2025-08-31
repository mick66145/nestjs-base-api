import { Injectable, Inject, LogLevel } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { BaseLoggerService } from './base-logger.service';
import { ConfigService } from '@nestjs/config';
import { LoggerConfigServiceInterface } from './logger-config.interface';

@Injectable()
export class SystemLoggerService extends BaseLoggerService {
  @Inject()
  private configService!: ConfigService;

  constructor(context: string) {
    super(context ?? 'SystemLogger');
  }

  onModuleInit(): void {
    const loggerConfig =
      this.configService.getOrThrow<LoggerConfigServiceInterface>(
        'logger.system',
      );

    const logger = WinstonModule.createLogger({
      transports: [
        BaseLoggerService.createWinstonFileTransport({
          level: loggerConfig.level as LogLevel,
          filename: 'system-log-%DATE%.log',
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
