import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import User from 'src/Client/application/entities/User/User';
import {
  AbstractAuthService,
  TokenTypeEnum,
} from 'src/Client/application/services/AuthService';

export abstract class AbstractGenericAuthProvider {
  abstract signAsync(payload: object): Promise<string>;
  abstract verifyAsync(token: string): Promise<object>;
}

@Injectable()
export default class AuthService implements AbstractAuthService {
  constructor(private authProvider: JwtService) {}

  async makeLoginTokenToUser(user: User): Promise<string> {
    return this.authProvider.signAsync({
      sub: user.id,
      username: user.name,
      tokentype: 'login',
    });
  }

  async makeToken({
    id,
    tokenType,
  }: {
    id: string;
    tokenType: TokenTypeEnum;
  }): Promise<string> {
    return this.authProvider.signAsync({
      sub: id,
      tokentype: tokenType,
    });
  }

  private async verify(token: string): Promise<Record<any, any>> {
    return this.authProvider.verifyAsync(token);
  }

  async validate(
    token: string,
    tokenType: TokenTypeEnum,
    sub?: string,
  ): Promise<boolean> {
    try {
      const payload = await this.verify(token);

      if (payload.tokentype !== tokenType) return false;

      if (sub && sub !== payload.sub) return false;

      return true;
    } catch (error) {
      return false;
    }
  }
}
