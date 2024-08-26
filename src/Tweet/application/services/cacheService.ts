export abstract class AbstractCacheService {
  abstract set(data: { key: string; value: Object | string }): Promise<void>;
  abstract get(key: string): Promise<any>;
  abstract setUseCaseResult<K extends string, T extends Object>(
    data: {
      [P in K]: string;
    } & { useCaseResult: T },
  ): Promise<void>;

  abstract getUseCaseResult<K extends string, T extends Object>(data: {
    [P in K]: string;
  }): Promise<T>;
}
