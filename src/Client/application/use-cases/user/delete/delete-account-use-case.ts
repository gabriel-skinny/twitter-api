import { Injectable } from '@nestjs/common';
import AbstractUserRepository from 'src/Client/application/repositories/user/userRepository';

@Injectable()
export class DeleteAccountUseCase {
  constructor(private readonly userRepository: AbstractUserRepository) {}

  async execute(userId: string) {
    await this.userRepository.delete(userId);
  }
}
