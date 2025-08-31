import { Prisma, PrismaClient } from '@prisma/client';

type Models = Prisma.TypeMap['meta']['modelProps'];

export const $PrismaWhereInput = Object.freeze({
  whereKeywordInput<
    T extends
      | Prisma.Args<PrismaClient[Models], 'findFirstOrThrow'>['where']
      | Prisma.Args<PrismaClient[Models], 'findUniqueOrThrow'>['where'],
  >(
    fields: Array<keyof Omit<T, 'OR' | 'AND' | 'NOT'>>,
    keyword: string,
    mode?: Prisma.QueryMode,
  ) {
    return fields.map((d) => ({ [d]: { contains: keyword, mode } }));
  },
  mergeWhereInput<
    T extends
      | Prisma.Args<PrismaClient[Models], 'findFirstOrThrow'>['where']
      | Prisma.Args<PrismaClient[Models], 'findUniqueOrThrow'>['where'],
  >(targetWhere: T | T[], where: T) {
    if (Array.isArray(targetWhere)) {
      targetWhere.push(where);
    } else {
      targetWhere = { ...targetWhere, ...where };
    }
  },
});
