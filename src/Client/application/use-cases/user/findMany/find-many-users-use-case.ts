import { Injectable } from '@nestjs/common';
import User from 'src/Client/application/entities/User/User';
import WrongValueError from 'src/Shared/errors/wrongValue';
import AbstractUserRepository from 'src/Client/application/repositories/user/userRepository';

interface IFindManyUserUseCaseParams {
  page?: number;
  perPage?: number;
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

  async execute(
    data?: IFindManyUserUseCaseParams,
  ): Promise<IFindManyUsersUseCaseReturn> {
    const page = data?.page || 1;
    const perPage = data?.perPage || 20;

    Object.keys(data.filter).map(
      (key) => data.filter[key] == undefined && delete data.filter[key],
    );

    const total = await this.userRepository.count(data?.filter);
    const skip = page * perPage - perPage;

    if (skip >= total) throw new WrongValueError('perPage');

    const users = await this.userRepository.findMany({
      skip,
      limit: perPage,
      filter: data?.filter,
      select: data?.select,
    });

    return {
      users,
      totalCount: total,
    };
  }
}
