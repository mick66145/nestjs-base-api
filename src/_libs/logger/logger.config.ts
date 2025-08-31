import { registerAs } from '@nestjs/config';
import { LoggerConfig } from './logger-config.interface';

const base = {
  level: process.env.BASE_LOGGER_LEVEL ?? 'info',
  maxSize: process.env.BASE_LOGGER_MAX_SIZE ?? '10m',
  maxFiles: process.env.BASE_LOGGER_MAX_FILES ?? '7d',
  fileSilent:
    (process.env.BASE_LOGGER_FILE_SILENT ?? 'false').toLowerCase() === 'true',
  consoleSilent:
    (process.env.BASE_LOGGER_CONSOLE_SILENT ?? 'false').toLowerCase() ===
    'true',
};

export default registerAs(
  'logger',
  (): LoggerConfig => ({
    base,
    system: {
      level: process.env.SYSTEM_LOGGER_LEVEL ?? base.level,
      maxSize: process.env.SYSTEM_LOGGER_MAX_SIZE ?? base.maxSize,
      maxFiles: process.env.SYSTEM_LOGGER_MAX_FILES ?? base.maxFiles,
      fileSilent:
        (
          process.env.SYSTEM_LOGGER_FILE_SILENT ??
          process.env.BASE_LOGGER_FILE_SILENT ??
          'false'
        ).toLowerCase() === 'true',
      consoleSilent:
        (
          process.env.SYSTEM_LOGGER_CONSOLE_SILENT ??
          process.env.BASE_LOGGER_CONSOLE_SILENT ??
          'false'
        ).toLowerCase() === 'true',
    },
    api: {
      level: process.env.API_LOGGER_LEVEL ?? base.level,
      maxSize: process.env.API_LOGGER_MAX_SIZE ?? base.maxSize,
      maxFiles: process.env.API_LOGGER_MAX_FILES ?? base.maxFiles,
      fileSilent:
        (
          process.env.API_LOGGER_FILE_SILENT ??
          process.env.BASE_LOGGER_FILE_SILENT ??
          'false'
        ).toLowerCase() === 'true',
      consoleSilent:
        (
          process.env.API_LOGGER_CONSOLE_SILENT ??
          process.env.BASE_LOGGER_CONSOLE_SILENT ??
          'false'
        ).toLowerCase() === 'true',
    },
    prisma: {
      level: process.env.PRISMA_LOGGER_LEVEL ?? base.level,
      maxSize: process.env.PRISMA_LOGGER_MAX_SIZE ?? base.maxSize,
      maxFiles: process.env.PRISMA_LOGGER_MAX_FILES ?? base.maxFiles,
      fileSilent:
        (
          process.env.PRISMA_LOGGER_FILE_SILENT ??
          process.env.BASE_LOGGER_FILE_SILENT ??
          'false'
        ).toLowerCase() === 'true',
      consoleSilent:
        (
          process.env.PRISMA_LOGGER_CONSOLE_SILENT ??
          process.env.BASE_LOGGER_CONSOLE_SILENT ??
          'false'
        ).toLowerCase() === 'true',
    },
  }),
);
