import { Body, Controller, Delete, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './auth.dto';
import { Response } from 'express';
import { AuthGuard } from './auth.guard';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiCreatedResponse({
    description: '회원가입 성공',
  })
  async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.signup(signUpDto);

    res
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })
      .status(201)
      .send({ message: '회원가입 성공' });
  }

  @Post('signin')
  @ApiCreatedResponse({
    description: '로그인 성공',
  })
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.signIn(signInDto);

    res
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })
      .send({ message: '로그인 성공' });
  }

  @Delete('signout')
  @ApiCookieAuth()
  @ApiOkResponse({
    description: '로그아웃 성공',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: '로그아웃 성공',
        },
      },
    },
  })
  @UseGuards(AuthGuard)
  async signOut(@Res() res: Response) {
    res
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .send({ message: '로그아웃 성공' });
  }
}
