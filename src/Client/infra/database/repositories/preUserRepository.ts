import { Injectable } from '@nestjs/common';
import PreUser from 'src/Client/application/entities/User/preUser';
import AbstractPreUserRepository from 'src/Client/application/repositories/preUser/preUserRepository';

@Injectable()
export default class PreUserRepository implements AbstractPreUserRepository {
  save(user: PreUser): Promise<void> {
    throw new Error('Method not implemented.');
  }
  existsByEmail(email: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  existsByName(name: string): Promise<boolean> {
    throw new Error('Method not implemented.');
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
