import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { NotificationGateway } from 'src/websocket/notification.gateway';
import { User } from '@prisma/client';
import {
  CreateCommentBodyDto,
  CreateCommentParamDto,
} from './dto/request/comment.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('comments')
export class CommentController {
  constructor(
    private commentService: CommentService,
    private notificationGateway: NotificationGateway,
  ) {}

  @Get(':parentId')
  async getComments(@Param('parentId') parentId: string) {
    const comments = await this.commentService.getComments(parentId);

    return { comments };
  }

  @Post(':parentId')
  @UseGuards(AuthGuard)
  async createComment(
    @Param() param: CreateCommentParamDto,
    @Body() body: CreateCommentBodyDto,
    @Req() req,
  ) {
    const { id: userId } = req.user as User;

    const res = await this.commentService.createComment({
      ...param,
      ...body,
      userId,
    });

    if (!res) {
      throw new InternalServerErrorException('댓글을 작성하지 못했습니다.');
    }

    return { message: '댓글이 작성되었습니다.' };
  }

  @Delete(':parentId')
  @UseGuards(AuthGuard)
  async deleteComment(@Param('parentId') parentId: string) {
    const res = await this.commentService.deleteComment(parentId);

    if (!res) {
      throw new InternalServerErrorException('댓글을 삭제하지 못했습니다.');
    }

    return { message: '댓글이 삭제되었습니다.' };
  }
}
