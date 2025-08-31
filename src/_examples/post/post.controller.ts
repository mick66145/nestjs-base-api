import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  Logger,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Prisma } from '@prisma/client';
import { abortIf } from 'src/_libs/api-response/abort.util';
import { ApiDataListResponse } from 'src/_libs/api-response/api-data.decorator';
import { ResourceListEntity } from 'src/_libs/api-response/resource-list.entity';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { FindAllQueryDto } from './dto/find-all-query.dto';

@ApiTags('文章')
@Controller('post')
export class PostController {
  private readonly logger = new Logger(PostController.name);

  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: '建立文章資料' })
  @ApiOkResponse({ type: PostEntity })
  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    return plainToInstance(
      PostEntity,
      await this.postService.create(createPostDto),
    );
  }

  @ApiOperation({ summary: '取得所有文章資料' })
  @ApiDataListResponse(PostEntity)
  @Get()
  async findAll(@Query() query: FindAllQueryDto) {
    const { page, limit } = query;

    const { result, ...meta } = await this.postService.pagination({
      page,
      limit,
      orderBy: { id: 'desc' },
    });

    return new ResourceListEntity(plainToInstance(PostEntity, result), meta);
  }

  @ApiOperation({ summary: '取得單一文章資料' })
  @ApiOkResponse({ type: PostEntity })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const where: Prisma.PostWhereUniqueInput = {
      id,
    };

    abortIf(
      !(await this.postService.exists(where)),
      '找無此項目',
      HttpStatus.NOT_FOUND,
    );

    return plainToInstance(PostEntity, await this.postService.findOne(where));
  }

  @ApiOperation({ summary: '修改文章資料' })
  @ApiOkResponse({ type: PostEntity })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const where: Prisma.PostWhereUniqueInput = {
      id,
    };

    abortIf(
      !(await this.postService.exists(where)),
      '找無此項目',
      HttpStatus.NOT_FOUND,
    );

    return this.postService.update(where, updatePostDto);
  }

  @ApiOperation({ summary: '刪除文章資料' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const where: Prisma.PostWhereUniqueInput = {
      id,
    };

    abortIf(
      !(await this.postService.exists(where)),
      '找無此項目',
      HttpStatus.NOT_FOUND,
    );

    await this.postService.remove(where);
  }
}
