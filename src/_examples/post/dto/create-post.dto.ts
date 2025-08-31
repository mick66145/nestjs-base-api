import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: '標題' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ example: '內容' })
  @IsNotEmpty()
  @IsString()
  content!: string;
}
