import { Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto, PutCommentDto } from './dto/request/comment.dto';

@Injectable()
export class CommentService {
  constructor(private commentRepository: CommentRepository) {}

  getComments(id: string) {
    return this.commentRepository.getComments(id);
  }

  createComment(createCommentDto: CreateCommentDto) {
    return this.commentRepository.createComment(createCommentDto);
  }

  putComment(id: string, data: PutCommentDto) {
    return this.commentRepository.putComment(id, data);
  }

  deleteComment(id: string) {
    return this.commentRepository.deleteComment(id);
  }
}
