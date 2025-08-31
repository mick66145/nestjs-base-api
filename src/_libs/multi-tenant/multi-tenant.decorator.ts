import {
  applyDecorators,
  Controller,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';

const tenantId = {
  name: 'companyId',
  description: '公司ID',
};

export function MultiTenantController(prefix: string) {
  const { name, description } = tenantId;
  return applyDecorators(
    ApiParam({
      name,
      description,
      type: Number,
      example: 1,
    }),
    Controller(`${prefix}/:${name}`),
  );
}

export function MultiTenantParam() {
  const { name } = tenantId;
  return Param(name, ParseIntPipe);
}
