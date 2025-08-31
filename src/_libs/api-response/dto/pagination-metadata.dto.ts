import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetadataDto {
  @ApiProperty({ description: '總筆數' })
  totalCount!: number;

  @ApiProperty({ description: '當前頁筆數' })
  currentPageCount!: number;

  @ApiProperty({ description: '當前頁' })
  currentPage!: number;

  @ApiProperty({ description: '總頁數' })
  totalPage!: number;
}
