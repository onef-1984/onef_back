import { Injectable } from '@nestjs/common';
import { ChangeNicknameDto, ChangeProfileImageDto } from 'src/auth/auth.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserById(userId: string) {
    const user = await this.userRepository.getUserById(userId);

    return user;
  }

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

  async changeProfileImage(
    changeProfileImageDto: ChangeProfileImageDto,
    userId: string,
  ) {
    return this.userRepository.changeProfileImage(
      changeProfileImageDto,
      userId,
    );
  }
}
