import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export function dealWithPrismaClientError(
  error: unknown,
  entityName: string = '',
) {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      throw new HttpException(`無此${entityName}`, HttpStatus.NOT_FOUND);
    }

    if (error.code === 'P2002') {
      const response = `${entityName}資料衝突 ${error.meta?.target}`;
      throw new HttpException(response, HttpStatus.CONFLICT);
    }

    const logger = new Logger('dealWithPrismaClientError');
    logger.error(error.code, error);

    const response = `${entityName} Prisma Error：${error.code}(${error.message})`;
    throw new HttpException(response, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export function catchPrismaErrorOrThrow(entityName: string = '') {
  return (error: unknown) => {
    dealWithPrismaClientError(error, entityName);
    throw error;
  };
}
