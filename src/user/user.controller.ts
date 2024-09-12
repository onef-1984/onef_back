import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
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
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDto } from './user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @ApiOkResponse({
    description: '내 정보 조회',
    type: UserResponseDto,
  })
  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Req() req: Request) {
    const { nickname } = req.user as User;

    return await this.userService.getUserByNickname(nickname);
  }

  @ApiOkResponse({
    description: '유저 정보 조회',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: '존재하지 않는 유저',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: '존재하지 않는 유저입니다',
        },
      },
    },
  })
  @Get(':userNickname')
  async getUser(@Param('userNickname') userNickname: string) {
    const user = await this.userService.getUserByNickname(userNickname);

    if (user) {
      return user;
    } else {
      throw new NotFoundException('존재하지 않는 유저입니다');
    }
  }

  @ApiInternalServerErrorResponse({
    description: '프로필 변경 실패',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: '프로필 변경에 실패했습니다',
        },
      },
    },
  })
  @ApiOkResponse({
    description: '프로필 변경 성공',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: '프로필 변경이 완료되었습니다',
        },
      },
    },
  })
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

    if (newUser) {
      return { message: '프로필 변경이 완료되었습니다' };
    } else {
      throw new InternalServerErrorException('프로필 변경에 실패했습니다');
    }
  }

  @ApiBadRequestResponse({
    description: '비밀번호 불일치',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: '비밀번호가 일치하지 않습니다',
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: '비밀번호 변경 실패',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: '비밀번호 변경에 실패했습니다',
        },
      },
    },
  })
  @ApiOkResponse({
    description: '비밀번호 변경 성공',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: '비밀번호 변경이 완료되었습니다',
        },
      },
    },
  })
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

    if (newUser) {
      return { message: '비밀번호 변경이 완료되었습니다' };
    } else {
      throw new InternalServerErrorException('비밀번호 변경에 실패했습니다');
    }
  }
}
