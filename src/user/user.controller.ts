import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { ChangeNicknameDto, ChangeProfileImageDto } from 'src/auth/auth.dto';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Req() req: Request) {
    const { id } = req.user as User;

    return await this.userService.getUserById(id);
  }

  @Get('reports')
  @UseGuards(AuthGuard)
  async getReports(@Req() req: Request) {
    const { id } = req.user as User;
    return this.userService.getUserReports(id);
  }

  @Patch('profile-image')
  @UseGuards(AuthGuard)
  async changeProfileImage(
    @Body() changeProfileImageDto: ChangeProfileImageDto,
    @Req() req: Request,
  ) {
    const { id: userId } = req.user as User;
    return this.userService.changeProfileImage(changeProfileImageDto, userId);
  }

  @Patch('nickname')
  @UseGuards(AuthGuard)
  async changeNickname(
    @Body() changeNicknameDto: ChangeNicknameDto,
    @Req() req: Request,
  ) {
    const { id } = req.user as User;

    const newUser = await this.userService.changeNickname(
      changeNicknameDto,
      id,
    );

    return newUser;
  }
}
