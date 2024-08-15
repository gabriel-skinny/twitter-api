interface ICacheServiceSetParams {
  value: string | Record<any, any> | number;
  key: string;
  expiresIn?: number;
}

export abstract class AbstractCacheService {
  public abstract get(key: string): Promise<string>;
  public abstract set(data: ICacheServiceSetParams): Promise<void>;
}

export interface IGenericCacheProviderSetParams {
  value: string | number;
  key: string;
  expiresIn?: number;
}
export abstract class AbstractGenericCacheProvider {
  public abstract get(key: string): Promise<string>;
  public abstract set(data: IGenericCacheProviderSetParams): Promise<void>;
}

export class CacheService implements AbstractCacheService {
  constructor(
    private abstractGenericCacheProvider: AbstractGenericCacheProvider,
  ) {}

  public async get(key: string): Promise<string> {
    return this.abstractGenericCacheProvider.get(key);
  }
  public async set({
    key,
    value,
    expiresIn,
  }: ICacheServiceSetParams): Promise<void> {
    let formatedValue: string | number;
    if (value instanceof Object) formatedValue = JSON.stringify(value);
    else formatedValue = value;

    await this.abstractGenericCacheProvider.set({
      key,
      value: formatedValue,
      expiresIn,
    });
  }
}
