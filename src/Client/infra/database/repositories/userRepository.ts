import { InjectModel } from '@nestjs/mongoose';
import User from 'src/Client/application/entities/User/User';
import AbstractUserRepository from 'src/Client/application/repositories/user/userRepository';
import { UserModel } from '../schemas/user';
import { Model } from 'mongoose';
import { userToUserModel } from '../mappers/userToUserModel';
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
  existsByEmail(email: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  existsByName(name: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
  findByEmail(email: string): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
