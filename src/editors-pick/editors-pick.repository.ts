import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEditorsPickDto } from './editors-pick.dto';

@Injectable()
export class EditorsPickRepository {
  constructor(private prisma: PrismaService) {}

  async getEditorsPick() {
    return await this.prisma.editorsPick.findFirst({
      orderBy: { createdAt: 'desc' },
      omit: { reportId: true },
      include: {
        report: {
          select: {
            id: true,
            title: true,
            book: { select: { cover: true } },
            user: { select: { nickname: true } },
          },
        },
      },
    });
  }

  async createEditorsPick({ description, reportId }: CreateEditorsPickDto) {
    return await this.prisma.editorsPick.create({
      data: {
        description,
        report: {
          connect: {
            id: reportId,
          },
        },
      },
    });
  }
}
