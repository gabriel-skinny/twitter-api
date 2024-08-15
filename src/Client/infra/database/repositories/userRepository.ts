import { InjectModel } from '@nestjs/mongoose';
import User from 'src/Client/application/entities/User/User';
import AbstractUserRepository from 'src/Client/application/repositories/user/userRepository';
import { UserModel } from '../mongodb/schemas/user';
import { Model } from 'mongoose';
import { userModelToUser, userToUserModel } from '../mappers/user';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class UserRepository implements AbstractUserRepository {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserModel>,
  ) {}

  async save(user: User): Promise<void> {
    const userModel = userToUserModel(user);

    await this.userModel.create(userModel);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const userModel = await this.userModel.exists({ email });

    return !!userModel;
  }

  async existsByName(name: string): Promise<boolean> {
    const userModel = await this.userModel.exists({ name });

    return !!userModel;
  }

  async findById(id: string): Promise<User | null> {
    const userModel = await this.userModel.findById(id);

    if (!userModel) return null;

    return userModelToUser(userModel);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userModel = await this.userModel.findOne({ email });

    if (!userModel) return null;

    return userModelToUser(userModel);
  }

  async delete(id: string): Promise<void> {
    await this.userModel.deleteOne({ id });
  }
}
