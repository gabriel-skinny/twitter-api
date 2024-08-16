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
    userEmail,
    tokenType,
  }: {
    userEmail: string;
    tokenType: TokenTypeEnum;
  }): Promise<string> {
    return this.authProvider.signAsync({ userEmail, tokentype: tokenType });
  }

  private async verify(token: string): Promise<Record<any, any>> {
    return this.authProvider.verifyAsync(token);
  }

  async validate(token: string, tokenType: TokenTypeEnum): Promise<boolean> {
    try {
      const payload = await this.verify(token);

      if (payload.tokentype !== tokenType) return false;

      return true;
    } catch (error) {
      return false;
    }
  }
}
