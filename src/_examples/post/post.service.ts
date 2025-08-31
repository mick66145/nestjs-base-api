import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/_libs/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPostDto: CreatePostDto) {
    const { title, content } = createPostDto;

    const data: Prisma.PostCreateInput = {
      title,
      content,
    };

    return this.prisma.post.create({ data });
  }

  findAll(params: {
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput;
  }) {
    const { where, orderBy } = params;

    return this.prisma.post.findMany({
      where,
      orderBy,
    });
  }

  pagination(params: {
    page?: number;
    limit?: number;
    cursor?: Prisma.PostWhereUniqueInput;
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput;
  }) {
    const { page, limit, where, orderBy } = params;

    return this.prisma.post.pagination({
      page,
      limit,
      where,
      orderBy,
    });
  }

  findOne(where: Prisma.PostWhereUniqueInput) {
    return this.prisma.post.findUnique({ where });
  }

  update(where: Prisma.PostWhereUniqueInput, updatePostDto: UpdatePostDto) {
    const { title, content } = updatePostDto;

    const data: Prisma.PostUpdateInput = {
      title,
      content,
    };

    return this.prisma.post.update({ where, data });
  }

  remove(where: Prisma.PostWhereUniqueInput) {
    return this.prisma.post.delete({ where });
  }

  exists(where: Prisma.PostWhereUniqueInput) {
    return this.prisma.post.exists({ where });
  }
}
