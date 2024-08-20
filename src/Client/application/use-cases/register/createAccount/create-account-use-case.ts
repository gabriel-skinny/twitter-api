import { Injectable } from '@nestjs/common';

import AbstractPreUserRepository from 'src/Client/application/repositories/preUser/preUserRepository';
import User from '../../../entities/User/User';
import AbstractUserRepository from '../../../repositories/user/userRepository';
import { AbstractAuthService } from '../../../services/AuthService';
import NotFoundCustomError from 'src/Shared/errors/notFound';
import AlreadyCreatedError from 'src/Shared/errors/alreadyCreated';

@Injectable()
export default class CreateAccountUseCase {
  constructor(
    private readonly preUserRepository: AbstractPreUserRepository,
    private readonly userRepository: AbstractUserRepository,
    private readonly authService: AbstractAuthService,
  ) {}

  async execute(preUserId: string): Promise<{ loginToken: string }> {
    const preUser = await this.preUserRepository.findById(preUserId);

    if (!preUser) throw new NotFoundCustomError('preUser');

    if (
      (await this.userRepository.existsByEmail(preUser.email)) ||
      (await this.userRepository.existsByName(preUser.name))
    )
      throw new AlreadyCreatedError('user');

    const user = new User({
      name: preUser.name,
      email: preUser.email,
      password_hash: preUser.password_hash,
    });

    await this.userRepository.save(user);

    const loginToken = await this.authService.makeLoginTokenToUser(user);

    return { loginToken };
  }
}
