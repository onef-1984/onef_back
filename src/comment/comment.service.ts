import { Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/request/comment.dto';

@Injectable()
export class CommentService {
  constructor(private commentRepository: CommentRepository) {}

  getComments(id: string) {
    return this.commentRepository.getComments(id);
  }

  createComment(createCommentDto: CreateCommentDto) {
    return this.commentRepository.createComment(createCommentDto);
  }

  putComment(id: string, comment: string) {
    return this.commentRepository.putComment(id, comment);
  }

  deleteComment(id: string) {
    return this.commentRepository.deleteComment(id);
  }
}
