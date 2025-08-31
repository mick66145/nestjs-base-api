import { LoggerService } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { existsExtension } from './extensions/exists.extension';
import { paginationExtension } from './extensions/pagination.extension';
import { findFirstOrCreateExtension } from './extensions/find-first-or-create.extension';
import { findUniqueOrCreateExtension } from './extensions/find-unique-or-create.extension';
import { softDeleteExtension } from './extensions/soft-delete.extension';

function extendClient(base: PrismaClient) {
  // Add as many as you'd like - no ugly types required!
  return base
    .$extends(existsExtension)
    .$extends(paginationExtension)
    .$extends(softDeleteExtension)
    .$extends(findFirstOrCreateExtension)
    .$extends(findUniqueOrCreateExtension);
}

class UntypedExtendedClient extends PrismaClient<{
  log: [
    {
      emit: 'event';
      level: 'query';
    },
  ];
}> {
  constructor(
    options?: ConstructorParameters<typeof PrismaClient>[0],
    logger?: LoggerService,
  ) {
    super(
      Object.assign({}, options, {
        log: [
          {
            emit: 'event',
            level: 'query',
          },
        ],
      }) as any,
    );

    this.$on('query', ({ query, params }) => {
      if (logger !== undefined) {
        logger.log(`query: ${query}`);
        logger.log(`params: ${params}`);
      }
    });

    return extendClient(this) as this;
  }
}

const ExtendedPrismaClient = UntypedExtendedClient as unknown as new (
  options?: ConstructorParameters<typeof PrismaClient>[0],
  logger?: LoggerService,
) => ReturnType<typeof extendClient>;

export { ExtendedPrismaClient };
