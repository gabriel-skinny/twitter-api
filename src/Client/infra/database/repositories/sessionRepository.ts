import { Injectable } from '@nestjs/common';
import UserSession from 'src/Client/application/entities/User/Session';
import AbstractUserSessionRepository from 'src/Client/application/repositories/session/sessionRepository';

@Injectable()
export default class UserSessionRepository
  implements AbstractUserSessionRepository
{
  save(userSession: UserSession): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findByUserIdAndIp(data: {
    userId: string;
    ip: string;
  }): Promise<UserSession | null> {
    throw new Error('Method not implemented.');
  }
  findAllUserSessionsByUserIdWhereNot<T extends keyof UserSession>(data: {
    userId: string;
    whereNot?: Partial<UserSession>;
    select?: { [P in T]: boolean };
  }): Promise<{ [P in T]: UserSession[P] }[] | null> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
