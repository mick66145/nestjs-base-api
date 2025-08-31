import { Prisma } from '@prisma/client';

type FindFirstOrCreateExtensionArgs<T> = Prisma.Args<T, 'findFirst'> &
  Pick<Prisma.Args<T, 'create'>, 'data'>;

export const findFirstOrCreateExtension = Prisma.defineExtension({
  name: 'findFirstOrCreate',
  model: {
    $allModels: {
      async findFirstOrCreate<
        TModel,
        TArgs extends FindFirstOrCreateExtensionArgs<TModel>,
      >(
        this: TModel,
        args?: TArgs,
      ): Promise<[Prisma.Result<TModel, TArgs, 'findFirstOrThrow'>, boolean]> {
        const context = Prisma.getExtensionContext(this);

        const {
          where,
          data,
          include,
          select,
          cursor,
          distinct,
          orderBy,
          skip,
          take,
        } = args ?? ({} as TArgs);

        let isNew = false;

        let result = await (context as any).findFirst({
          where,
          select,
          cursor,
          distinct,
          orderBy,
          skip,
          take,
          include,
        });

        if (result === null) {
          isNew = true;
          result = await (context as any).create({
            data,
            select,
            include,
          });
        }

        return [result, isNew];
      },
    },
  },
});
