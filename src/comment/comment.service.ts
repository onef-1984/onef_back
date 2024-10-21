import { Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/request/comment.dto';

@Injectable()
export class CommentService {
  constructor(private commentRepository: CommentRepository) {}

  async getComments(id: string) {
    return await this.commentRepository.getComments(id);
  }

  createComment(createCommentDto: CreateCommentDto) {
    return this.commentRepository.createComment(createCommentDto);
  }

  deleteComment(id: string) {
    return this.commentRepository.deleteComment(id);
  }
}
