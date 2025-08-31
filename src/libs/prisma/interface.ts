import { PrismaService } from 'src/_libs/prisma/prisma.service';

export type ExtendedPrismaServiceTransaction = Omit<
  PrismaService,
  | '$extends'
  | '$transaction'
  | '$disconnect'
  | '$connect'
  | '$on'
  | '$use'
  | 'onModuleInit'
>;
