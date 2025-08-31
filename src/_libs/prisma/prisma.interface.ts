import { PrismaService } from './prisma.service';

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
