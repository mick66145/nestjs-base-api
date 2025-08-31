import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginationMetadataDto } from './dto/pagination-metadata.dto';

export function ApiDataListResponse<T>(
  entity: Type<T>,
  options?: {
    hasMeta?: boolean;
  },
) {
  const { hasMeta = true } = options ?? {};

  const listData = {
    list: {
      type: 'array',
      items: { $ref: getSchemaPath(entity) },
    },
  };

  if (hasMeta) {
    Object.assign(listData, {
      meta: {
        $ref: getSchemaPath(PaginationMetadataDto),
      },
    });
  }

  return applyDecorators(
    ApiExtraModels(entity, PaginationMetadataDto),
    ApiOkResponse({
      schema: {
        properties: listData,
        required: ['list'],
      },
    }),
  );
}
