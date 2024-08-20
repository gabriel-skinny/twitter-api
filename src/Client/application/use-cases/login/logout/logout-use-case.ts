import { Injectable } from '@nestjs/common';
import NotFoundCustomError from 'src/Shared/errors/notFound';
import AbstractUserSessionRepository from 'src/Client/application/repositories/session/sessionRepository';

export interface ILogoutUseCaseParams {
  userId: string;
  ip: string;
}

export abstract class AbstractLogoutUseCase {
  abstract execute(data: ILogoutUseCaseParams): Promise<void>;
}

@Injectable()
export default class LogoutUseCase extends AbstractLogoutUseCase {
  constructor(
    private readonly userSessionRepository: AbstractUserSessionRepository,
  ) {
    super();
  }

  async execute({ userId, ip }: ILogoutUseCaseParams) {
    const userSession = await this.userSessionRepository.findByUserIdAndIp({
      userId,
      ip,
    });

    if (!userSession) throw new NotFoundCustomError('User session');

    await this.userSessionRepository.delete(userSession.id);
  }
}
