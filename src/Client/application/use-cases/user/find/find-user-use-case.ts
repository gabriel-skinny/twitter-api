import { Injectable } from '@nestjs/common';
import User from 'src/Client/application/entities/User/User';
import NotFoundCustomError from 'src/Client/application/errors/notFound';
import AbstractUserRepository from 'src/Client/application/repositories/user/userRepository';

@Injectable()
export class FindUserUseCase {
  constructor(private userRepository: AbstractUserRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) throw new NotFoundCustomError('user');

    return user;
  }
}
