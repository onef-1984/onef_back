import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthRepository } from './auth.repository';
import { jwtConfig } from 'src/config/jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY) private jwt: ConfigType<typeof jwtConfig>,
    private authRepository: AuthRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          if (request && request.cookies) return request.cookies['accessToken'];
          else return null;
        },
      ]),
      secretOrKey: jwt.accessSecret,
    });
  }

  async validate(payload): Promise<any> {
    const user = await this.authRepository.findUserByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
