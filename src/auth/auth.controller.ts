import {
  Body,
  Controller,
  Delete,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './auth.dto';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const { refreshToken: Token } = req.cookies as { refreshToken: string };
    const { accessToken, refreshToken } = await this.authService.refresh(Token);

    if (accessToken) {
      res
        .cookie('accessToken', accessToken, { httpOnly: true })
        .cookie('refreshToken', refreshToken, { httpOnly: true })
        .send('토큰 재발급 성공');
    } else {
      throw new UnauthorizedException('토근이 만료되었습니다.');
    }
  }

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.signup(signUpDto);

    res
      .cookie('accessToken', accessToken, { httpOnly: true })
      .cookie('refreshToken', refreshToken, { httpOnly: true })
      .send('회원가입 성공');
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    const { accessToken, refreshToken } =
      await this.authService.signIn(signInDto);

    res
      .cookie('accessToken', accessToken, { httpOnly: true })
      .cookie('refreshToken', refreshToken, { httpOnly: true })
      .send('로그인 성공');
  }

  @Delete('signout')
  @UseGuards(AuthGuard())
  async signOut(@Res() res: Response) {
    res
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .send('로그아웃 성공');
  }
}
