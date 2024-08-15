import { AbstractGenericCacheProvider } from './redis';

interface ICacheServiceSetParams {
  value: string | Record<any, any> | number;
  key: string;
  expiresIn?: number;
}

export abstract class AbstractCacheService {
  public abstract get(key: string): Promise<string>;
  public abstract set(data: ICacheServiceSetParams): Promise<void>;
}

export class CacheService implements AbstractCacheService {
  constructor(
    private abstractGenericCacheProvider: AbstractGenericCacheProvider,
  ) {}

  public async get(key: string): Promise<string> {
    return this.abstractGenericCacheProvider.get(key);
  }

  public async getObjectField<T extends Record<string, any>>(
    key: string,
    field: keyof T,
  ): Promise<string> {
    return this.abstractGenericCacheProvider.getHash({
      key,
      field: field as string,
    });
  }

  public async getAllObject<T>(key: string): Promise<T> {
    return this.abstractGenericCacheProvider.getHashAll(key);
  }

  public async set({
    key,
    value,
    expiresIn,
  }: ICacheServiceSetParams): Promise<void> {
    if (value instanceof Object) {
      await this.abstractGenericCacheProvider.setHash({
        key,
        value,
      });
    } else {
      await this.abstractGenericCacheProvider.set({
        key,
        value,
        expiresIn,
      });
    }
  }
}
