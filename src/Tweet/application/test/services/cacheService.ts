import { AbstractCacheService } from '../../services/cacheService';

export class CacheServiceMock implements AbstractCacheService {
  async set(data: { key: string; value: Object | string }): Promise<void> {}
  async get(key: string): Promise<any> {}
  async setUseCaseResult<K extends string, T extends Object>(
    data: { [P in K]: string } & { useCaseResult: T },
  ): Promise<void> {}

  async getUseCaseResult<K extends string, T extends Object>(data: {
    [P in K]: string;
  }): Promise<T> {
    return false as any;
  }
}
