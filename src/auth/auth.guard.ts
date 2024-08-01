import { Request } from 'express';
import { Observable } from 'rxjs';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return this.validateRequest(request);
  }

  private validateRequest(request: Request) {
    const accessToken = request.cookies['accessToken'];

    if (accessToken) {
      try {
        request.user = this.authService.verify(accessToken, 'access');

        return true;
      } catch (error) {
        // 엑세스 토큰이랍씨고 뭔가 오긴 했는데 이상한 문자열일 때
        console.error(error);
        throw new UnauthorizedException('로그인이 필요합니다');
      }
    } else {
      throw new UnauthorizedException('로그인이 필요합니다');
    }
  }
}
