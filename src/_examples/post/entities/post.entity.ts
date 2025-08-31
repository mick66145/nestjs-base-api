import { ApiProperty } from '@nestjs/swagger';
import { Post } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PostEntity implements Post {
  @ApiProperty({ example: 1 })
  @Expose()
  id!: number;

  @ApiProperty()
  @Expose()
  createdAt!: Date;

  @ApiProperty()
  @Expose()
  updatedAt!: Date;

  @ApiProperty({ example: '標題' })
  @Expose()
  title!: string;

  @ApiProperty({ example: '內容' })
  @Expose()
  content!: string;
}
