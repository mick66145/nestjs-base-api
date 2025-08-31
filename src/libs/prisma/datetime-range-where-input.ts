// 檔案範例: src/utils/prisma-helpers.ts

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Prisma, PrismaClient } from '@prisma/client';

dayjs.extend(utc);

type Models = Prisma.TypeMap['meta']['modelProps'];
type WhereInput =
  | Prisma.Args<PrismaClient[Models], 'findFirstOrThrow'>['where']
  | Prisma.Args<PrismaClient[Models], 'findUniqueOrThrow'>['where'];

const getUtcBoundary = (date: string | Date): Date => {
  return dayjs(date).toDate();
};

export const $PrismaDateTimeRangeWhereInput = Object.freeze({
  dateTimeRangeInput<T extends WhereInput>(
    startColumnName: keyof T,
    endColumnName: keyof T,
    startDate: string | Date | null | undefined,
    endDate: string | Date | null | undefined,
  ): { OR: T[] } | undefined {
    if (!startDate && !endDate) return undefined;
    const orConditions: T[] = [];
    const filterStartDate = startDate ? getUtcBoundary(startDate) : null;
    const filterEndDate = endDate ? getUtcBoundary(endDate) : null;
    if (filterStartDate && filterEndDate) {
      orConditions.push({
        [startColumnName]: { lte: filterEndDate },
        [endColumnName]: { gte: filterStartDate },
      } as unknown as T);
      orConditions.push({
        [startColumnName]: { lte: filterEndDate },
        [endColumnName]: null,
      } as unknown as T);
    }
    if (filterEndDate && !filterStartDate) {
      orConditions.push({
        [startColumnName]: { lte: filterEndDate },
      } as unknown as T);
    }
    if (filterStartDate && !filterEndDate) {
      orConditions.push({
        [endColumnName]: { gte: filterStartDate },
      } as unknown as T);
      orConditions.push({ [endColumnName]: null } as unknown as T);
    }
    if (orConditions.length === 0) return undefined;
    return { OR: orConditions };
  },
});
