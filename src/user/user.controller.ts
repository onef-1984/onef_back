import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { ChangeNicknameDto } from 'src/auth/auth.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard())
  async getMe(@Req() req: Request) {
    const { id, email, nickname } = req.user as User;

    return { id, email, nickname };
  }

  @Get('reports')
  @UseGuards(AuthGuard())
  async getReports(@Req() req: Request) {
    const { id } = req.user as User;
    return this.userService.getUserReports(id);
  }

  @Patch('nickname')
  @UseGuards(AuthGuard())
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
