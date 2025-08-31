import { Global, Module } from '@nestjs/common';
import { SystemLoggerService } from './system-logger.service';
import { ApiLoggerService } from './api-logger.service';
import { PrismaLoggerService } from './prisma-logger.service';

@Global()
@Module({
  providers: [SystemLoggerService, ApiLoggerService, PrismaLoggerService],
  exports: [SystemLoggerService, ApiLoggerService, PrismaLoggerService],
})
export class LoggerModule {}
