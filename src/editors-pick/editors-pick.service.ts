import { Injectable } from '@nestjs/common';
import { EditorsPickRepository } from './editors-pick.repository';
import { CreateEditorsPickDto } from './editors-pick.dto';

@Injectable()
export class EditorsPickService {
  constructor(private editorsPickRepository: EditorsPickRepository) {}

  async getEditorsPick() {
    return await this.editorsPickRepository.getEditorsPick();
  }

  async createEditorsPick(createEditorsPickDto: CreateEditorsPickDto) {
    return await this.editorsPickRepository.createEditorsPick(
      createEditorsPickDto,
    );
  }
}
