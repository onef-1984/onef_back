import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.OAUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.BASE_URL + '/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  // refreshToken을 얻고 싶다면 해당 메서드 설정 필수
  authorizationParams(): { [key: string]: string } {
    return {
      access_type: 'offline',
      prompt: 'select_account',
    };
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { name, emails, provider, photos } = profile;
    const socialLoginUserInfo = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      socialProvider: provider,
      profileImage: photos[0].value,
      accessToken,
      refreshToken,
    };
    try {
      done(null, socialLoginUserInfo, accessToken);
    } catch (err) {
      done(err, false);
    }
  }
}
