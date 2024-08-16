import AuthService from '@infra/services/authService';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import {
  AuthenticationTypeDecoretor,
  IsPublicDecoretor,
} from '../decoretors/authenticationType';
import { AbstractAuthService } from 'src/Client/application/services/AuthService';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AbstractAuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublicDecoretor = this.reflector.get(
      IsPublicDecoretor,
      context.getHandler(),
    );
    if (isPublicDecoretor) return true;

    const request = context.switchToHttp().getRequest();

    const authenticationType = this.reflector.get(
      AuthenticationTypeDecoretor,
      context.getHandler(),
    );

    if (!authenticationType) throw new UnauthorizedException();

    const token = this.extractTokenFromHeader(request);

    if (!(await this.authService.validate(token, authenticationType)))
      throw new UnauthorizedException();

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
