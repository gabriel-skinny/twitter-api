import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import PreUser from 'src/Client/application/entities/User/preUser';
import AbstractPreUserRepository from 'src/Client/application/repositories/preUser/preUserRepository';
import { preUserModelToPreUser } from '../mappers/preUser';
import { PreUserModel } from '../mongodb/schemas/preUser';
import BaseRepository from './baseRepository';

@Injectable()
export default class PreUserRepository
  extends BaseRepository<PreUserModel, PreUser>
  implements AbstractPreUserRepository
{
  constructor(
    @InjectModel(PreUserModel.name) private preUserModel: Model<PreUserModel>,
  ) {
    super(preUserModel, preUserModelToPreUser);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const userModel = await this.preUserModel.exists({ email });

    return !!userModel;
  }
  async existsByName(name: string): Promise<boolean> {
    const userModel = await this.preUserModel.exists({ name });

    return !!userModel;
  }

  async deleteByEmail(email: string): Promise<void> {
    await this.preUserModel.deleteOne({ email });
  }

  async findByEmail(email: string): Promise<PreUser | null> {
    const userModel = await this.preUserModel.findOne({ email });

    if (!userModel) return null;

    return preUserModelToPreUser(userModel);
  }
}
