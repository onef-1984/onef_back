import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-kakao';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.OAUTH_KAKAO_CLIENT_ID,
      callbackURL: process.env.BASE_URL + '/api/auth/kakao',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { id, username, _json } = profile;
    const socialLoginUserInfo = {
      id,
      username,
      email: _json.kakao_account.email,
      accessToken,
      refreshToken,
    };
    try {
      done(null, socialLoginUserInfo);
    } catch (err) {
      done(err, false);
    }
  }
}
