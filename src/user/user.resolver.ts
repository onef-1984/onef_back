import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from './user.service';
import {
  BadRequestException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ChangePasswordInput, ChangeProfileInput } from 'src/auth/auth.dto';
import { Message } from 'src/util/util.schema';
import { User } from './user.dto';
import { ConfigType } from '@nestjs/config';
import { keyConfig } from 'src/config/key.config';

@Resolver()
export class UserResolver {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    @Inject(keyConfig.KEY) private key: ConfigType<typeof keyConfig>,
  ) {}

  @Query(() => User)
  @UseGuards(AuthGuard)
  async getMe(@Context('req') { user: { nickname } }: { user: User }) {
    return await this.userService.getUserByNickname(nickname);
  }

  @Query(() => User)
  async getUser(@Args('userNickname') userNickname: string) {
    const user = await this.userService.getUserByNickname(userNickname);

    if (user) {
      return user;
    } else {
      throw new NotFoundException('존재하지 않는 유저입니다');
    }
  }

  @Mutation(() => Message)
  @UseGuards(AuthGuard)
  async promotionUser(
    @Args('key') key: string,
    @Context('req') { user: { id: userId } }: { user: User },
  ) {
    if (key !== this.key.promotionKey) {
      throw new UnauthorizedException('올바르지 않은 키입니다.');
    }

    const newUser = await this.userService.promotionUser(userId);

    if (newUser) {
      return { message: '유저 권한이 승급되었습니다' };
    } else {
      throw new InternalServerErrorException('유저 권한 승급에 실패했습니다');
    }
  }

  @Mutation(() => Message)
  @UseGuards(AuthGuard)
  async changeProfile(
    @Args('changeProfileInput') changeProfileInput: ChangeProfileInput,
    @Context('req') { user: { id: userId } }: { user: User },
  ) {
    const { nickname, profileImage, bio } = changeProfileInput;

    const newUser = await this.userService.changeProfile(
      { nickname, profileImage, bio },
      userId,
    );

    if (newUser) {
      return { message: '프로필 변경이 완료되었습니다' };
    } else {
      throw new InternalServerErrorException('프로필 변경에 실패했습니다');
    }
  }

  @Mutation(() => Message)
  @UseGuards(AuthGuard)
  async changePassword(
    @Args('changePasswordDto') changePasswordDto: ChangePasswordInput,
    @Context('req') { user: { id: userId, email } }: { user: User },
  ) {
    const { oldPassword, newPassword } = changePasswordDto;

    const isPasswordMatch = await this.authService.isPasswordMatch(
      oldPassword,
      email,
    );

    if (!isPasswordMatch) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다');
    }

    const newUser = await this.userService.changePassword(newPassword, userId);

    if (newUser) {
      return { message: '비밀번호 변경이 완료되었습니다' };
    } else {
      throw new InternalServerErrorException('비밀번호 변경에 실패했습니다');
    }
  }
}
