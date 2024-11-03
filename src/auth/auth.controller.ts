import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './auth.dto';
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

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(baseConfig.KEY) private base: ConfigType<typeof baseConfig>,
  ) {}

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

  @UseGuards(Auth('google'))
  @Get('google')
  async loginGoogle(@Req() req, @Res() res: Response) {
    //1. 가입확인
    const user = await this.authService.getUserByEmail(req.user.email);

    const input = {
      email: req.user.email,
      password: 'OAuth',
      nickname: req.user.firstName,
    };

    const { accessToken, refreshToken } = user
      ? await this.authService.signIn(input)
      : await this.authService.signup(input);

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
      .redirect(this.base.url);
  }

  @UseGuards(Auth('kakao'))
  @Get('kakao')
  async loginKakao(@Req() req, @Res() res: Response) {
    const user = await this.authService.getUserByEmail(req.user.email);

    const input = {
      email: req.user.email,
      password: 'OAuth',
      nickname: req.user.username,
    };

    const { accessToken, refreshToken } = user
      ? await this.authService.signIn(input)
      : await this.authService.signup(input);

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
      .redirect(this.base.url);
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
