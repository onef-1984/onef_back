import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { ChangePasswordDto, ChangeProfileDto } from 'src/auth/auth.dto';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Req() req: Request) {
    const { nickname } = req.user as User;

    return await this.userService.getUserByNickname(nickname);
  }

  @Get(':userNickname')
  async getUser(@Param('userNickname') userNickname: string) {
    return await this.userService.getUserByNickname(userNickname);
  }

  @Patch('profile')
  @UseGuards(AuthGuard)
  async changeProfile(
    @Body() changeProfileDto: ChangeProfileDto,
    @Req() req: Request,
  ) {
    const { id } = req.user as User;
    const { nickname, profileImage, bio } = changeProfileDto;

    const newUser = await this.userService.changeProfile(
      { nickname, profileImage, bio },
      id,
    );

    return newUser;
  }

  @Patch('password')
  @UseGuards(AuthGuard)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request,
  ) {
    const { id, email } = req.user as User;
    const { oldPassword, newPassword } = changePasswordDto;

    const isPasswordMatch = await this.authService.isPasswordMatch(
      oldPassword,
      email,
    );

    if (!isPasswordMatch) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다');
    }

    const newUser = await this.userService.changePassword(newPassword, id);

    return newUser;
  }
}
