import { Injectable } from '@nestjs/common';
import { ChangeNicknameDto } from 'src/auth/auth.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async changeNickname(changeNicknameDto: ChangeNicknameDto, userId: string) {
    const newUser = await this.userRepository.changeNickname(
      changeNicknameDto,
      userId,
    );

    return newUser;
  }

  async getUserReports(userId: string) {
    return this.userRepository.getUserReports(userId);
  }
}
