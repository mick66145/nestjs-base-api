import { Injectable, OnModuleInit } from '@nestjs/common';
import { ExtendedPrismaClient } from './prisma-client-extended';
import { PrismaLoggerService } from 'src/_libs/logger/prisma-logger.service';

@Injectable()
export class PrismaService
  extends ExtendedPrismaClient
  implements OnModuleInit
{
  constructor(private readonly logger: PrismaLoggerService) {
    super({}, logger);
  }

  async onModuleInit() {
    await this.$connect();
  }
}
