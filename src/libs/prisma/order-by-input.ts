import { Prisma, PrismaClient } from '@prisma/client';

type Models = Prisma.TypeMap['meta']['modelProps'];

export const $PrismaOrderByInput = Object.freeze({
  queryOrderBy<
    T extends Prisma.Args<PrismaClient[Models], 'findMany'>['orderBy'],
  >(orderString: string): T[] {
    if (!orderString) throw new Error('排序字串不可為空');

    return orderString
      .split(',')
      .map((item) => item.trim())
      .map((orderByString) => {
        const [column, sortOrder] = orderByString
          .split(':')
          .map((s) => s.trim());
        if (!column) throw new Error('找無此欄位');

        const order: Prisma.SortOrder =
          (sortOrder as Prisma.SortOrder) || 'asc';
        if (order !== 'asc' && order !== 'desc')
          throw new Error('排序規則錯誤');
        return this.createOrderByObject(column, order) as T;
      });
  },

  createOrderByObject(column: string, order: Prisma.SortOrder): any {
    const columnParts = column.split('.');

    if (columnParts.length > 1) {
      const [first, ...rest] = columnParts;
      return {
        [first]: this.createOrderByObject(rest.join('.'), order),
      };
    }

    return { [column]: order };
  },
});
