import { Injectable } from '@nestjs/common';
import User from 'src/Client/application/entities/User/User';
import {
  AbstractAuthService,
  TokenTypeEnum,
} from 'src/Client/application/services/AuthService';

@Injectable()
export default class AuthService implements AbstractAuthService {
  async makeLoginTokenToUser(user: User): Promise<string> {
    console.log('Auth Method not implemented.');

    return 'tokenToString';
  }

  async makeToken(data: {
    userEmail: string;
    tokenType: TokenTypeEnum;
  }): Promise<string> {
    console.log('Auth Method not implemented.');

    return 'token';
  }
}
