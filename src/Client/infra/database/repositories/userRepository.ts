import { InjectModel } from '@nestjs/mongoose';
import User from 'src/Client/application/entities/User/User';
import AbstractUserRepository from 'src/Client/application/repositories/user/userRepository';
import { UserModel } from '../mongodb/schemas/user';
import { Model } from 'mongoose';
import { userModelToRaw, userToUserModel } from '../mappers/user';
import { Injectable } from '@nestjs/common';
import BaseRepository from './baseRepository';

@Injectable()
export default class UserRepository
  extends BaseRepository<UserModel, User>
  implements AbstractUserRepository
{
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserModel>,
  ) {
    super(userModel, userModelToRaw, userToUserModel);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const userModel = await this.userModel.exists({ email });

    return !!userModel;
  }

  async existsByName(name: string): Promise<boolean> {
    const userModel = await this.userModel.exists({ name });

    return !!userModel;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userModel = await this.userModel.findOne({ email });

    if (!userModel) return null;

    return userModelToRaw(userModel);
  }

  async findMany({
    limit,
    skip,
    filter,
    select,
  }: {
    limit?: number;
    skip?: number;
    filter?: Omit<Partial<User>, 'name'> & { name?: string | RegExp };
    select?: { [K in keyof User]?: boolean };
  }): Promise<User[] | null> {
    return this.userModel.find(
      filter,
      {},
      { fields: select, limit, skip: skip },
    );
  }

  async count(
    query: Omit<Partial<User>, 'name'> & { name?: string | RegExp },
  ): Promise<number> {
    return this.userModel.countDocuments(query);
  }
}
