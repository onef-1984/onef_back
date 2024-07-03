import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { SignInDto, SignUpDto } from './auth.dto';
import { AuthRepository } from './auth.repository';
import { genSalt, hash, compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from 'src/config/jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(jwtConfig.KEY) private jwt: ConfigType<typeof jwtConfig>,
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  generateAccessToken(payload: { email: string; nickname: string }) {
    return this.jwtService.sign(payload, {
      secret: this.jwt.accessSecret,
      expiresIn: '1h',
    });
  }

  generateRefreshToken(payload: { email: string; nickname: string }) {
    return this.jwtService.sign(payload, {
      secret: this.jwt.refreshSecret,
      expiresIn: '30d',
    });
  }

  async signup(signUpDto: SignUpDto) {
    const { password } = signUpDto;

    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);

    const res = await this.authRepository.createUser({
      ...signUpDto,
      password: hashedPassword,
    });

    const accessToken = this.generateAccessToken(res);
    const refreshToken = this.generateRefreshToken(res);

    return { accessToken, refreshToken };
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.authRepository.findUserByEmail(signInDto.email);
    const payload = { email: user.email, nickname: user.nickname };

    if (user && (await compare(signInDto.password, user.password))) {
      const accessToken = this.generateAccessToken(payload);
      const refreshToken = this.generateRefreshToken(payload);

      return { accessToken, refreshToken };
    } else if (!user) {
      throw new BadRequestException('이메일을 다시 확인해주세요');
    } else {
      throw new BadRequestException('비밀번호가 일치하지 않습니다');
    }
  }
}
