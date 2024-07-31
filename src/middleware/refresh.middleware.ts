import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class RefreshMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { accessToken, refreshToken } = req.cookies;

    if (accessToken) {
      try {
        // accessToken이 유효하지 않으면 에러 발생
        this.authService.accessVerify(accessToken);
      } catch (error) {
        if (refreshToken) {
          try {
            // 리프레시 토큰으로 새로운 accessToken, refreshToken 발급
            const token = this.authService.refresh(refreshToken);

            res
              .cookie('accessToken', token.accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
              })
              .cookie('refreshToken', token.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
              });
          } catch (error) {
            next();
          }
        }
      }
    }

    next();
  }
}
