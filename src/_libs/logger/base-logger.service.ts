import {
  LoggerService,
  ConsoleLogger,
  OnModuleInit,
  LogLevel,
} from '@nestjs/common';
import { utilities } from 'nest-winston';
import winston from 'winston';
import 'winston-daily-rotate-file';

export abstract class BaseLoggerService
  extends ConsoleLogger
  implements LoggerService, OnModuleInit
{
  private logger!: LoggerService;

  constructor(context?: string) {
    super(context ?? 'BaseLogger');
  }

  onModuleInit() {
    if (this.logger === undefined) {
      throw Error('Logger has not been fully configured yet.');
    }
  }

  protected setLogger(logger: LoggerService) {
    this.logger = logger;
  }

  setContext(context: string): void {
    super.setContext(context);
  }

  protected static createWinstonFileTransport(options?: {
    level?: LogLevel;
    filename?: string;
    maxSize?: string;
    maxFiles?: string;
    silent?: boolean;
  }): winston.transport {
    const {
      level = 'info',
      filename = 'log-%DATE%.log',
      maxSize = '10m',
      maxFiles = '7d',
      silent = false,
    } = options ?? {};

    return new winston.transports.DailyRotateFile({
      silent,
      level,
      dirname: 'logs',
      filename,
      datePattern: 'YYYY-MM-DD',
      maxSize,
      maxFiles,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
          ({ timestamp, level, message, context, stack }) => {
            return `${timestamp} [${context}] ${level}: ${message}${stack ? `\n${stack}` : ''}`;
          },
        ),
      ),
    });
  }

  protected static createWinstonConsoleTransport(options?: {
    level?: LogLevel;
    silent?: boolean;
  }): winston.transport {
    const { level = 'info', silent = false } = options ?? {};

    return new winston.transports.Console({
      silent,
      level,
      format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike(),
      ),
    });
  }

  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    if (optionalParams.length === 0) {
      optionalParams.push(this.context);
    }
    this.logger.log(message, ...optionalParams);
  }

  /**
   * Write a 'fatal' level log.
   */
  fatal(message: any, ...optionalParams: any[]) {
    if (optionalParams.length === 0) {
      optionalParams.push(this.context);
    }
    this.logger.fatal?.(message, ...optionalParams);
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    this.logger.error(message, ...optionalParams);
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    if (optionalParams.length === 0) {
      optionalParams.push(this.context);
    }
    this.logger.warn(message, ...optionalParams);
  }

  /**
   * Write a 'debug' level log.
   */
  debug(message: any, ...optionalParams: any[]) {
    if (optionalParams.length === 0) {
      optionalParams.push(this.context);
    }
    this.logger.debug?.(message, ...optionalParams);
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose(message: any, ...optionalParams: any[]) {
    if (optionalParams.length === 0) {
      optionalParams.push(this.context);
    }
    this.logger.verbose?.(message, ...optionalParams);
  }
}
