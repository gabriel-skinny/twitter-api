import { Injectable } from '@nestjs/common';
import NotFoundCustomError from 'src/Client/application/errors/notFound';
import AbstractUserRepository from 'src/Client/application/repositories/user/userRepository';

interface IParamsUpdateAccount {
  id: string;
  userData: {
    bannerPictureS3Url?: string;
    profilePictureS3Url?: string;
    bio?: string;
    location?: string;
    website?: string;
    profileName?: string;
  };
}

@Injectable()
export default class UpdateAccountUseCase {
  constructor(private readonly userRepository: AbstractUserRepository) {}

  async execute({ id, userData }: IParamsUpdateAccount) {
    const user = await this.userRepository.findById(id);

    if (!user) throw new NotFoundCustomError('user');

    user.updateFields(userData);

    await this.userRepository.updateById({ id: user.id, data: user });
  }
}
