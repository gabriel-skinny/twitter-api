import { Injectable } from '@nestjs/common';
import User from 'src/Client/application/entities/User/User';
import {
  AbstractAuthService,
  TokenTypeEnum,
} from 'src/Client/application/services/AuthService';

@Injectable()
export default class AuthService implements AbstractAuthService {
  makeLoginTokenToUser(user: User): Promise<string> {
    throw new Error('Method not implemented.');
  }
  makeToken(data: {
    userEmail: string;
    tokenType: TokenTypeEnum;
  }): Promise<string> {
    throw new Error('Method not implemented.');
  }
}
