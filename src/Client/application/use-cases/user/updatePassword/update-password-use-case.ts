import { Injectable } from '@nestjs/common';
import { Password } from 'src/Client/application/entities/User/Password';
import NotFoundCustomError from 'src/Client/application/errors/notFound';
import WrongValueError from 'src/Client/application/errors/wrongValue';
import AbstractUserRepository from 'src/Client/application/repositories/user/userRepository';

interface IUpdatePasswordParams {
  userId: string;
  newPassword: string;
}

@Injectable()
export default class UpdatePasswordUseCase {
  constructor(private readonly userRepository: AbstractUserRepository) {}

  async execute({ userId, newPassword }: IUpdatePasswordParams) {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new NotFoundCustomError('user');

    if (user.password_hash.isTheSameValue(newPassword))
      throw new WrongValueError('password');

    const newPasswordHash = new Password(newPassword);
    user.password_hash = newPasswordHash;

    await this.userRepository.updateById({ id: user.id, data: user });
  }
}
