import PreUser from '../../entities/User/preUser';
import AbstractPreUserRepository from './preUserRepository';

export default class InMemoryPreUserRepositroy
  implements AbstractPreUserRepository
{
  public preUserDatabase: PreUser[] = [];

  async save(preUser: PreUser): Promise<void> {
    this.preUserDatabase.push(preUser);
  }

  async existsByEmail(email: string): Promise<boolean> {
    return !!this.preUserDatabase.filter((u) => u.email == email).length;
  }
  async existsByName(name: string): Promise<boolean> {
    return !!this.preUserDatabase.filter((u) => u.name == name).length;
  }

  async findById(id: string): Promise<PreUser | null> {
    const preUser = this.preUserDatabase.find((u) => u.id == id);

    if (!preUser) return null;

    return preUser;
  }

  async deleteByEmail(email: string): Promise<void> {
    this.preUserDatabase = this.preUserDatabase.filter(
      (u) => u.email !== email,
    );
  }

  async findByEmail(email: string): Promise<PreUser | null> {
    const preUser = this.preUserDatabase.find(
      (preUser) => preUser.email == email,
    );

    if (!preUser) return null;

    return preUser;
  }

  async updateById(data: {
    id: string;
    data: Partial<PreUser>;
  }): Promise<void> {
    const findIndex = this.preUserDatabase.findIndex((u) => u.id == data.id);

    Object.keys(data.data).map(
      (key) => this.preUserDatabase[findIndex][key] == data.data[key],
    );
  }
}
