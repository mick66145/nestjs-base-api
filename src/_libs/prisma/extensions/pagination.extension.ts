import { Prisma } from '@prisma/client';

export type PaginationResult<T> = {
  result: T;
  totalCount: number;
  currentPageCount: number;
  currentPage: number;
  totalPage: number;
};

type PaginationExtensionArgs<T> = {
  page?: number;
  limit?: number;
} & Omit<Prisma.Args<T, 'findMany'>, 'take'>;

export const paginationExtension = Prisma.defineExtension({
  name: 'pagination',
  model: {
    $allModels: {
      async pagination<TModel, TArgs extends PaginationExtensionArgs<TModel>>(
        this: TModel,
        args?: TArgs,
      ): Promise<PaginationResult<Prisma.Result<TModel, TArgs, 'findMany'>>> {
        const context = Prisma.getExtensionContext(this);

        const { page = 0, limit = 10, include, ...arg } = args ?? ({} as TArgs);

        const totalCount = await (context as any).count(arg);

        let totalPage = totalCount > 0 ? 1 : 0;
        if (page > 0) {
          Object.assign(arg, {
            skip: (page - 1) * limit,
            take: limit,
          });
          totalPage = Math.ceil(totalCount / limit);
        }

        const result = await (context as any).findMany({ ...arg, include });

        return {
          result,
          totalCount,
          currentPageCount: result.length,
          currentPage: page || 1,
          totalPage,
        };
      },
    },
  },
});
