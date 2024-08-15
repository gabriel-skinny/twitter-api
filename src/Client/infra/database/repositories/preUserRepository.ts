import { Injectable } from '@nestjs/common';
import PreUser from 'src/Client/application/entities/User/preUser';
import AbstractPreUserRepository from 'src/Client/application/repositories/preUser/preUserRepository';
import { AbstractCacheService } from '../redis/cacheService';

@Injectable()
export default class PreUserRepository implements AbstractPreUserRepository {
  constructor(private CacheService: AbstractCacheService) {}

  async save(preUser: PreUser): Promise<void> {
    await this.CacheService.set({
      key: 'preUser',
      value: preUser,
      expiresIn: preUser.expiresIn,
    });
  }
  async existsByEmail(email: string): Promise<boolean> {
    return false;
  }
  async existsByName(name: string): Promise<boolean> {
    return false;
  }
  findById(id: string): Promise<PreUser | null> {
    throw new Error('Method not implemented.');
  }
  deleteByEmail(email: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findByEmail(email: string): Promise<PreUser | null> {
    throw new Error('Method not implemented.');
  }
}
