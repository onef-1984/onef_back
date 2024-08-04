import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { ChangePasswordDto, ChangeProfileDto } from 'src/auth/auth.dto';
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

  @Patch('profile')
  @UseGuards(AuthGuard)
  async changeProfile(
    @Body() changeProfileDto: ChangeProfileDto,
    @Req() req: Request,
  ) {
    const { id } = req.user as User;
    const { nickname, profileImage } = changeProfileDto;

    const newUser = await this.userService.changeProfile(
      { nickname, profileImage },
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
    const { id } = req.user as User;
    const { password } = changePasswordDto;

    const newUser = await this.userService.changePassword(password, id);

    return newUser;
  }
}
