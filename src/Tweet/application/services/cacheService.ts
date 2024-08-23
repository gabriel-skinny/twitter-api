export abstract class AbstractCacheService {
  abstract set(data: { key: string; value: Object | string }): Promise<void>;
  abstract get(key: string): Promise<any>;
}
