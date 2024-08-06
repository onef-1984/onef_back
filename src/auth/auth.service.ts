import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { SignInDto, SignUpDto } from './auth.dto';
import { AuthRepository } from './auth.repository';
import { genSalt, hash, compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from 'src/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { UtilService } from 'src/util/util.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    @Inject(jwtConfig.KEY) private jwt: ConfigType<typeof jwtConfig>,
    private authRepository: AuthRepository,
    private jwtService: JwtService,
    private utilService: UtilService,
  ) {}

  generateToken(
    payload: Pick<User, 'id' | 'email' | 'nickname' | 'role'>,
    type: 'access' | 'refresh',
  ) {
    const secret =
      type === 'access' ? this.jwt.accessSecret : this.jwt.refreshSecret;
    const expiresIn = type === 'access' ? '1h' : '30d';

    const token = this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });

    return token;
  }

  verify(token: string, type: 'access' | 'refresh') {
    const secret =
      type === 'access' ? this.jwt.accessSecret : this.jwt.refreshSecret;

    const { id, nickname, email, role } = this.jwtService.verify(token, {
      secret,
    });

    return { id, nickname, email, role };
  }

  refresh(refresh: string) {
    const payload = this.verify(refresh, 'refresh');

    const accessToken = this.generateToken(payload, 'access');
    const refreshToken = this.generateToken(payload, 'refresh');

    return { accessToken, refreshToken };
  }

  async signup(signUpDto: SignUpDto) {
    const { password, email } = signUpDto;
    const user = await this.authRepository.findUserByEmail(email);

    if (user) throw new BadRequestException('이미 존재하는 이메일입니다');

    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);

    const payload = await this.authRepository.createUser({
      ...signUpDto,
      password: hashedPassword,
    });

    const accessToken = this.generateToken(payload, 'access');
    const refreshToken = this.generateToken(payload, 'refresh');

    return { accessToken, refreshToken };
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.authRepository.findUserByEmail(signInDto.email);

    if (user && (await compare(signInDto.password, user.password))) {
      const payload = this.utilService.omit(user, ['password']);

      const accessToken = this.generateToken(payload, 'access');
      const refreshToken = this.generateToken(payload, 'refresh');

      return { accessToken, refreshToken };
    } else if (!user) {
      throw new BadRequestException('이메일을 다시 확인해주세요');
    } else {
      throw new BadRequestException('비밀번호가 일치하지 않습니다');
    }
  }
}
