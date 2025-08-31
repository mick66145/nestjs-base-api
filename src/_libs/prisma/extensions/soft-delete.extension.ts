import { Prisma } from '@prisma/client';

type SoftDeleteExtensionArgs<T> = {
  columnName?: string;
  columnType?: 'date' | 'number' | 'boolean';
  columnValue?: any;
} & Prisma.Args<T, 'delete'>;

type SoftDeleteManyExtensionArgs<T> = {
  columnName?: string;
  columnType?: 'date' | 'number' | 'boolean';
  columnValue?: any;
} & Prisma.Args<T, 'deleteMany'>;

export const softDeleteExtension = Prisma.defineExtension({
  name: 'softDelete',
  model: {
    $allModels: {
      async softDelete<TModel, TArgs extends SoftDeleteExtensionArgs<TModel>>(
        this: TModel,
        args?: TArgs,
      ): Promise<Prisma.Result<TModel, TArgs, 'update'>> {
        const context = Prisma.getExtensionContext(this);

        const {
          columnName = 'deletedAt',
          columnType = 'date',
          columnValue,
          where,
        } = args ?? ({} as TArgs);

        const data = {};

        switch (columnType) {
          case 'date':
            data[columnName] = new Date();
            break;
          case 'number':
            data[columnName] = 1;
            break;
          case 'boolean':
            data[columnName] = false;
            break;
          default:
            throw new Error('欄位型態錯誤');
        }

        if (columnValue !== undefined) {
          data[columnName] = columnValue;
        }

        return (context as any).update({
          where,
          data,
        });
      },

      async softDeleteMany<
        TModel,
        TArgs extends SoftDeleteManyExtensionArgs<TModel>,
      >(
        this: TModel,
        args?: TArgs,
      ): Promise<Prisma.Result<TModel, TArgs, 'updateMany'>> {
        const context = Prisma.getExtensionContext(this);

        const {
          columnName = 'deletedAt',
          columnType = 'date',
          columnValue,
          where,
        } = args ?? ({} as TArgs);

        const data = {};

        switch (columnType) {
          case 'date':
            data[columnName] = new Date();
            break;
          case 'number':
            data[columnName] = 1;
            break;
          case 'boolean':
            data[columnName] = false;
            break;
          default:
            throw new Error('欄位型態錯誤');
        }

        if (columnValue !== undefined) {
          data[columnName] = columnValue;
        }

        return (context as any).updateMany({
          where,
          data,
        });
      },
    },
  },
});
