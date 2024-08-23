import { AbstractCacheService } from '../../services/cacheService';

export class CacheServiceMock implements AbstractCacheService {
  async set(data: { key: string; value: Object | string }): Promise<void> {}
  async get(key: string): Promise<any> {}
}
