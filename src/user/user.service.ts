import { BadRequestException, Injectable } from '@nestjs/common';
import { ChangeProfileDto } from 'src/auth/auth.dto';
import { UserRepository } from './user.repository';
import { genSalt, hash, compare } from 'bcryptjs';
import { AuthRepository } from 'src/auth/auth.repository';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private authRepository: AuthRepository,
  ) {}

  async changePassword(password: string, userId: string) {
    const user = await this.authRepository.findUserById(userId);

    if (await compare(password, user.password))
      throw new BadRequestException('기존 비밀번호와 동일합니다');

    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);

    const newUser = await this.userRepository.changePassword(
      hashedPassword,
      userId,
    );

    if (newUser) {
      return { message: '비밀번호 변경이 완료되었습니다' };
    } else {
      throw new BadRequestException('비밀번호 변경에 실패했습니다');
    }
  }

  async changeProfile(changeProfileDto: ChangeProfileDto, userId: string) {
    const user = await this.userRepository.changeProfile(
      changeProfileDto,
      userId,
    );

    if (user) {
      return { message: '프로필 변경이 완료되었습니다' };
    } else {
      throw new BadRequestException('프로필 변경에 실패했습니다');
    }
  }

  async getUserById(userId: string) {
    return this.userRepository.getUserById(userId);
  }

  async getUserReports(userId: string) {
    return this.userRepository.getUserReports(userId);
  }
}
