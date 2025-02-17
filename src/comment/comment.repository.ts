import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/request/comment.dto';

@Injectable()
export class CommentRepository {
  constructor(private prisma: PrismaService) {}
  getComments(id: string) {
    return this.prisma.comment.findMany({
      where: { OR: [{ parentId: id }, { reportId: id }] },
      orderBy: { createdAt: 'asc' },
      include: {
        replies: true,
        user: {
          select: {
            id: true,
            nickname: true,
            profileImage: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async createComment({ parentId, userId, comment, depth }: CreateCommentDto) {
    const link = depth === 0 ? 'report' : 'parent';

    return await this.prisma.comment.create({
      data: {
        comment,
        user: { connect: { id: userId } },
        [link]: {
          connect: { id: parentId },
        },
      },
    });
  }

  async putComment(id: string, comment: string) {
    return await this.prisma.comment.update({
      where: { id },
      data: {
        comment,
      },
    });
  }

  async deleteComment(id: string) {
    return await this.prisma.comment.delete({
      where: { id },
    });
  }
}
