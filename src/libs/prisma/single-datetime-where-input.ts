import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'; // UTC plugin is good practice
import { Prisma, PrismaClient } from '@prisma/client';

dayjs.extend(utc);

// ... type definitions
type Models = Prisma.TypeMap['meta']['modelProps'];
type WhereInput =
  | Prisma.Args<PrismaClient[Models], 'findFirstOrThrow'>['where']
  | Prisma.Args<PrismaClient[Models], 'findUniqueOrThrow'>['where'];

export const $PrismaSingleDateTimeWhereInput = Object.freeze({
  /**
   * Generates a Prisma WhereInput for a date range by parsing date strings
   * and automatically respecting their embedded timezone offset.
   *
   * **IMPORTANT**: For this to work correctly, the input should be a `string`
   * containing timezone information (e.g., "2025-08-08T00:00:00+08:00" or
   * "Fri Aug 08 2025 00:00:00 GMT+0800"). Passing a JS `Date` object will
   * cause calculations to be based on the system's local timezone.
   *
   * @param dateFieldName The name of the date field in your Prisma model.
   * @param startTime A date string with timezone info.
   * @param endTime A date string with timezone info.
   * @returns A Prisma WhereInput object or undefined.
   */
  singleDateTimeInput<T extends WhereInput>(
    dateFieldName: keyof T,
    // Note the type change: `string` is the preferred input.
    startTime: string | Date | undefined | null,
    endTime: string | Date | undefined | null,
  ): T | undefined {
    if (!startTime && !endTime) {
      return undefined;
    }

    // This helper function is now much simpler.
    const getUtcBoundary = (date: string | Date): Date => {
      // Step 1: Let Dayjs parse the input. If it's a string with an offset
      // (like "...+08:00"), Dayjs will understand and preserve it.
      const d = dayjs(date);

      // Step 3: Convert the result to a standard JS Date object.
      // Dayjs handles the conversion to the correct UTC timestamp for Prisma.
      return d.toDate();
    };

    const dateConditions: Prisma.DateTimeFilter = {};

    if (startTime) {
      dateConditions.gte = getUtcBoundary(startTime);
    }
    if (endTime) {
      dateConditions.lte = getUtcBoundary(endTime);
    }

    if (Object.keys(dateConditions).length === 0) {
      return undefined;
    }

    return {
      [dateFieldName]: dateConditions,
    } as T;
  },
});
