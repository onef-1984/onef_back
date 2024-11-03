import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class RefreshMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken && !refreshToken) return next();

    try {
      this.authService.verify(accessToken, 'access');
    } catch {
      try {
        const token = this.authService.refresh(refreshToken);

        req.cookies = {
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        };

        res
          .cookie('accessToken', token.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
          })
          .cookie('refreshToken', token.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
          });
      } catch {
        throw new UnauthorizedException('로그인이 필요합니다');
      }
    } finally {
      next();
    }
  }
}
