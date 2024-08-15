import { Injectable } from '@nestjs/common';
import UserSession from 'src/Client/application/entities/User/Session';
import AbstractUserSessionRepository from 'src/Client/application/repositories/session/sessionRepository';
import BaseRepository from './baseRepository';
import { UserSessionModel } from '../mongodb/schemas/userSession';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  preUserSessionModelToRaw,
  preUserSessionToModel,
} from '../mappers/userSession';

export interface IFindAllUserSessionsByUserIdWhereNotParams<
  T extends keyof UserSession,
> {
  userId: string;
  whereNot?: Partial<UserSession>;
  select?: { [P in T]: boolean };
}

@Injectable()
export default class UserSessionRepository
  extends BaseRepository<UserSessionModel, UserSession>
  implements AbstractUserSessionRepository
{
  constructor(
    @InjectModel(UserSessionModel.name)
    private userSessionModel: Model<UserSessionModel>,
  ) {
    super(userSessionModel, preUserSessionModelToRaw, preUserSessionToModel);
  }

  async findByUserIdAndIp({
    userId,
    ip,
  }: {
    userId: string;
    ip: string;
  }): Promise<UserSession | null> {
    const userSessionModel = await this.userSessionModel.findOne({
      userId,
      ip,
    });

    if (!userSessionModel) return null;

    return preUserSessionModelToRaw(userSessionModel);
  }

  async findAllUserSessionsByUserIdWhereNot<T extends keyof UserSession>({
    userId,
    select,
    whereNot,
  }: IFindAllUserSessionsByUserIdWhereNotParams<T>): Promise<
    { [P in T]: UserSession[P] }[] | null
  > {
    const userSessionModel = await this.userSessionModel.findOne({
      userId,
      $where: `$not: {${whereNot}}`,
    });

    if (!userSessionModel) return null;

    return preUserSessionModelToRaw(userSessionModel) as any;
  }
}
