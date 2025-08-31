import { Prisma } from '@prisma/client';

type FindUniqueOrCreateExtensionArgs<T> = Prisma.Args<T, 'findUnique'> &
  Pick<Prisma.Args<T, 'create'>, 'data'>;

export const findUniqueOrCreateExtension = Prisma.defineExtension({
  name: 'findUniqueOrCreate',
  model: {
    $allModels: {
      async findUniqueOrCreate<
        TModel,
        TArgs extends FindUniqueOrCreateExtensionArgs<TModel>,
      >(
        this: TModel,
        args?: TArgs,
      ): Promise<[Prisma.Result<TModel, TArgs, 'findUniqueOrThrow'>, boolean]> {
        const context = Prisma.getExtensionContext(this);

        const { where, data, include, select } = args ?? ({} as TArgs);

        let isNew = false;

        let result = await (context as any).findUnique({
          where,
          select,
          include,
        });

        if (result == undefined) {
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
