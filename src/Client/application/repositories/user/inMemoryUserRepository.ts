import User from '../../entities/User/User';
import AbstractUserRepository from './userRepository';

export default class InMemoryUserRepositroy implements AbstractUserRepository {
  public userDatabase: User[] = [];

  async save(user: User): Promise<void> {
    this.userDatabase.push(user);
  }

  async existsByEmail(email: string): Promise<boolean> {
    return !!this.userDatabase.filter((u) => u.email == email).length;
  }
  async existsByName(name: string): Promise<boolean> {
    return !!this.userDatabase.filter((u) => u.name == name).length;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.userDatabase.find((u) => u.id == id);

    if (!user) return null;

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.userDatabase.find((u) => u.email == email);

    if (!user) return null;

    return user;
  }

  async delete(id: string): Promise<void> {
    this.userDatabase = this.userDatabase.filter((u) => u.id !== id);
  }

  async updateById(data: { id: string; data: User }): Promise<void> {
    const findIndex = this.userDatabase.findIndex((u) => u.id == data.id);

    this.userDatabase[findIndex] = data.data;
  }

  async findMany(data: {
    limit?: number;
    skip?: number;
    filter?: Omit<Partial<User>, 'name'> & { name?: string | RegExp };
    select?: { [K in keyof User]?: boolean };
  }): Promise<User[] | null> {
    return this.userDatabase.slice(data.skip, data.skip + data.limit);
  }

  async count(
    data: Omit<Partial<User>, 'name'> & { name?: string | RegExp },
  ): Promise<number> {
    return this.userDatabase.length;
  }
}
