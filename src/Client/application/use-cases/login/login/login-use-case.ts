import UserSession, {
  SessionDeviceTypesEnum,
} from 'src/Client/application/entities/User/Session';
import AbstractSessionRepository from 'src/Client/application/repositories/session/sessionRepository';
import AbstractUserRepository from 'src/Client/application/repositories/user/userRepository';
import { AbstractAuthService } from 'src/Client/application/services/AuthService';
import { Injectable } from '@nestjs/common';
import NotFoundCustomError from 'src/Shared/errors/notFound';
import WrongValueError from 'src/Shared/errors/wrongValue';
import AlreadyCreatedError from 'src/Shared/errors/alreadyCreated';

interface ILoginUseCaseParams {
  email: string;
  password: string;
  ip: string;
  deviceType: SessionDeviceTypesEnum;
}

@Injectable()
export default class LoginUseCase {
  constructor(
    private readonly userRepository: AbstractUserRepository,
    private readonly authService: AbstractAuthService,
    private readonly userSessionRepository: AbstractSessionRepository,
  ) {}

  async execute({
    email,
    password,
    ip,
    deviceType,
  }: ILoginUseCaseParams): Promise<{ loginToken: string }> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new NotFoundCustomError('user');

    if (!user.password_hash.isTheSameValue(password))
      throw new WrongValueError('password');

    if (
      await this.userSessionRepository.findByUserIdAndIp({
        userId: user.id,
        ip,
      })
    )
      throw new AlreadyCreatedError('User session');

    const userSession = new UserSession({
      userId: user.id,
      ip,
      deviceType,
    });

    await this.userSessionRepository.save(userSession);

    const loginToken = await this.authService.makeLoginTokenToUser(user);

    return { loginToken };
  }
}
