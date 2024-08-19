import { Injectable } from '@nestjs/common';
import User from 'src/Client/application/entities/User/User';
import WrongValueError from 'src/Client/application/errors/wrongValue';
import AbstractUserRepository from 'src/Client/application/repositories/user/userRepository';

interface IFindManyUserUseCaseParams {
  page: number;
  perPage: number;
  filter?: {
    name?: string | RegExp;
  };
  select?: { [K in keyof User]?: boolean };
}

interface IFindManyUsersUseCaseReturn {
  users: User[];
  totalCount: number;
}

@Injectable()
export class FindManyUsersUseCase {
  constructor(private userRepository: AbstractUserRepository) {}

  async execute({
    page = 1,
    perPage = 20,
    filter,
    select,
  }: IFindManyUserUseCaseParams): Promise<IFindManyUsersUseCaseReturn> {
    const total = await this.userRepository.count(filter);
    const skip = page * perPage - perPage;

    if (skip >= total) throw new WrongValueError('perPage');

    const users = await this.userRepository.findMany({
      skip,
      limit: perPage,
      filter,
      select,
    });

    return {
      users,
      totalCount: total,
    };
  }
}
