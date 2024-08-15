import PreUser from '../../entities/User/preUser';

export default abstract class AbstractPreUserRepository {
  abstract save(user: PreUser): Promise<void>;
  abstract existsByEmail(email: string): Promise<boolean>;
  abstract existsByName(name: string): Promise<boolean>;
  abstract findById(id: string): Promise<PreUser | null>;
  abstract deleteByEmail(email: string): Promise<void>;
  abstract findByEmail(email: string): Promise<PreUser | null>;
  abstract updateById(data: {
    id: string;
    data: Partial<PreUser>;
  }): Promise<void>;
}
