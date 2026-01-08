import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import { TransformEmptyStringToUndefined } from '../transform/transform-to';

export function IntIdsQuery(idName: string = '') {
  return applyDecorators(
    ApiPropertyOptional({
      type: String,
      description: `${idName} ID 列表，以","分隔的字串，如：1,2,3`,
    }),
    IsOptional(),
    IsArray(),
    IsInt({ each: true }),
    Transform(
      ({ value }) =>
        Array.isArray(value) ? value : String(value).split(',').map(Number),
      { toClassOnly: true },
    ),
    TransformEmptyStringToUndefined,
  );
}

export function StringIdsQuery(idName: string = '') {
  return applyDecorators(
    ApiPropertyOptional({
      type: String,
      description: `${idName} ID 列表，以","分隔的字串，如：1,2,3`,
    }),
    IsOptional(),
    IsArray(),
    IsString({ each: true }),
    Transform(
      ({ value }) => (Array.isArray(value) ? value : String(value).split(',')),
      { toClassOnly: true },
    ),
    TransformEmptyStringToUndefined,
  );
}

// Ref: https://github.com/typestack/class-transformer/issues/550#issuecomment-802224051
const valueToBoolean = (value: any) => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (['true', 'on', 'yes', '1'].includes(value.toLowerCase())) {
    return true;
  }
  if (['false', 'off', 'no', '0'].includes(value.toLowerCase())) {
    return false;
  }
  return undefined;
};

export const ToBoolean = () => {
  const toPlain = Transform(
    ({ value }) => {
      return value;
    },
    {
      toPlainOnly: true,
    },
  );
  const toClass = (target: any, key: string) => {
    return Transform(
      ({ obj }) => {
        return valueToBoolean(obj[key]);
      },
      {
        toClassOnly: true,
      },
    )(target, key);
  };
  return function (target: any, key: string) {
    toPlain(target, key);
    toClass(target, key);
  };
};
