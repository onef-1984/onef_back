import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInInput, SignUpInput } from './auth.dto';
import { Response } from 'express';
import { AuthGuard } from './auth.guard';
import { AuthGuard as Auth } from '@nestjs/passport';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ConfigType } from '@nestjs/config';
import { baseConfig } from 'src/config/base.config';
import { User } from '@prisma/client';
import { keyConfig } from 'src/config/key.config';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  cookieOptions = { httpOnly: true, secure: true, sameSite: 'none' } as const;

  async commentOauthLogic(
    nickname: string,
    req: { user: User },
    res: Response,
    serviceName: string,
  ) {
    const user = await this.authService.getUserByEmail(req.user.email);

    const input = {
      email: req.user.email,
      password: 'OAuth',
      nickname,
      profileImage: req.user.profileImage,
    };
    try {
      const { accessToken, refreshToken } = user
        ? await this.authService.signIn(input)
        : await this.authService.signup(input);

      res
        .cookie('accessToken', accessToken, this.cookieOptions)
        .cookie('refreshToken', refreshToken, this.cookieOptions)
        .send({ message: `${serviceName} 로그인 성공` });
    } catch (error) {
      if (error.response.message === '비밀번호가 일치하지 않습니다') {
        res.status(400).send({
          message: `${req.user.email}\n계정이 이미 존재합니다.`,
        });
      }
    }
  }

  constructor(
    private readonly authService: AuthService,
    @Inject(baseConfig.KEY) private base: ConfigType<typeof baseConfig>,
    @Inject(keyConfig.KEY) private key: ConfigType<typeof keyConfig>,
  ) {}

  @Post('signup')
  @ApiCreatedResponse({
    description: '회원가입 성공',
  })
  async signUp(@Body() signUpDto: SignUpInput, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.signup(signUpDto);

    res
      .cookie('accessToken', accessToken, this.cookieOptions)
      .cookie('refreshToken', refreshToken, this.cookieOptions)
      .status(201)
      .send({ message: '회원가입 성공' });
  }

  @Post('signin')
  @ApiCreatedResponse({
    description: '로그인 성공',
  })
  async signIn(@Body() signInDto: SignInInput, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.signIn(signInDto);

    res
      .cookie('accessToken', accessToken, this.cookieOptions)
      .cookie('refreshToken', refreshToken, this.cookieOptions)
      .send({ message: '로그인 성공' });
  }

  @UseGuards(Auth('google'))
  @Get('google')
  async googleAuth() {
    return 'Google OAuth';
  }

  @UseGuards(Auth('kakao'))
  @Get('kakao')
  async kakaoAuth() {
    return 'kakao OAuth';
  }

  @UseGuards(Auth('google'))
  @Post('google/callback')
  async loginGoogle(
    @Req() req: { user: User & { firstName: string } },
    @Res() res: Response,
  ) {
    this.commentOauthLogic(req.user.firstName, req, res, 'google');
  }

  @UseGuards(Auth('kakao'))
  @Post('kakao/callback')
  async loginKakao(
    @Req() req: { user: User & { username: string } },
    @Res() res: Response,
  ) {
    this.commentOauthLogic(req.user.nickname, req, res, 'kakao');
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

  @Delete('terminateUser/:userId')
  @UseGuards(AuthGuard)
  async terminateUser(
    @Req() { user }: { user: User },
    @Param('userId') userId: string,
    @Body('key') key: string,
  ) {
    // 관리자 권한도 아니면서, 남의 아이디를 삭제하려 하면 권한이 없는거지
    if (user.role !== 'ADMIN' && user.id !== userId) {
      throw new UnauthorizedException('권한이 없습니다.');
    }

    if (key !== this.key.terminateKey) {
      throw new UnauthorizedException('올바르지 않은 키입니다.');
    }

    const terminatedUser = await this.authService.terminateUserById(user.id);

    if (terminatedUser) {
      return { message: '유저 삭제 성공' };
    } else {
      return { message: '유저 삭제 실패' };
    }
  }
}
