import { Observable } from 'rxjs';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: GqlExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const type = context.getType();
    let request;

    switch (type) {
      case 'http':
        request = (context as ExecutionContext).switchToHttp().getRequest();
        break;

      case 'graphql':
        const { req } = GqlExecutionContext.create(context).getContext();
        request = req;
        break;
    }

    return this.validateRequest(request);
  }

  private validateRequest(request) {
    const accessToken = request.cookies['accessToken'];

    if (!accessToken) return false;

    try {
      request.user = this.authService.verify(accessToken, 'access');

      return true;
    } catch (error) {
      throw new UnauthorizedException('로그인이 필요합니다');
    }
  }
}
