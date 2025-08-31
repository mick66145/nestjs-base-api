import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, IsPositive, Min } from 'class-validator';
import { TransformFalsyToUndefined } from '../transform/transform-to';

export class PaginationQueryDto {
  @ApiPropertyOptional({ description: '分頁頁數（0表示不分頁）', default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @TransformFalsyToUndefined()
  page: number = 0;

  @ApiPropertyOptional({ description: '每頁數量', default: 10 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @TransformFalsyToUndefined()
  limit: number = 10;
}
