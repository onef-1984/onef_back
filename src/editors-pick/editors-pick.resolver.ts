import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EditorsPickService } from './editors-pick.service';
import { Message } from 'src/util/util.schema';
import { EditorsPick } from './editors-pick.dto';

@Resolver()
export class EditorsPickResolver {
  constructor(private editorsPickService: EditorsPickService) {}

  @Query(() => EditorsPick)
  getEditorsPick() {
    return this.editorsPickService.getEditorsPick();
  }

  @Mutation(() => Message)
  async createEditorsPick(
    @Args('reportId') reportId: string,
    @Args('description') description: string,
  ) {
    const res = this.editorsPickService.createEditorsPick({
      reportId,
      description,
    });

    if (res) return { message: '에디터스픽 생성 성공' };
    else return { message: '에디터스픽 생성 실패' };
  }
}
