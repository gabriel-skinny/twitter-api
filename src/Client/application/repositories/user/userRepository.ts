import User from '../../entities/User/User';

type FilterType = Omit<Partial<User>, 'name'> & { name?: string | RegExp };

export default abstract class AbstractUserRepository {
  abstract save(user: User): Promise<void>;
  abstract existsByEmail(email: string): Promise<boolean>;
  abstract existsByName(name: string): Promise<boolean>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findMany(data: {
    limit?: number;
    skip?: number;
    filter?: FilterType;
    select?: { [K in keyof User]?: boolean };
  }): Promise<User[] | null>;
  abstract delete(id: string): Promise<void>;
  abstract updateById(data: { id: string; data: User }): Promise<void>;
  abstract count(data: FilterType): Promise<number>;
}
