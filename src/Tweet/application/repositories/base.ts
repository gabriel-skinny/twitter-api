import { BaseTweet } from '../entities/baseTweet';

export default abstract class AbstractBaseTweetRepository<T = BaseTweet> {
  abstract save(data: T): Promise<void>;
  abstract existsById(id: string): Promise<boolean>;
  abstract findById(id: string): Promise<T | null>;
  abstract deleteById(id: string): Promise<void>;
  abstract updateById(data: { id: string; data: Partial<T> }): Promise<void>;
}
