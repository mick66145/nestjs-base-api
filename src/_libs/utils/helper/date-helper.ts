import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

type dateFormatterType = typeof Dayjs | string | typeof Date;
type dateFormatterReturnType<T> = T extends typeof Dayjs
  ? Dayjs
  : T extends string
    ? string
    : Date;

export const dateFormatter = Object.freeze({
  from<T extends dateFormatterType = typeof Dayjs>(
    date: string | Date,
    options?: {
      tz?: string;
      offset?: number;
      format?: T;
    },
  ): dateFormatterReturnType<T> {
    const { tz, offset, format } = options ?? {};

    let dDate = dayjs.utc(date);

    if (tz !== undefined) {
      dDate = dDate.tz(tz);
    } else {
      if (offset !== undefined) {
        dDate = dDate.utcOffset(offset);
      }
    }

    if (format === undefined) {
      return dDate as any;
    } else if (typeof format === 'string') {
      return dDate.format(format) as any;
    } else if (format === Date) {
      return dDate.toDate() as any;
    } else {
      throw new Error('Invalid format type');
    }
  },
});
