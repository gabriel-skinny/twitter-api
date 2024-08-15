import Redis from 'ioredis';

export interface IGenericCacheProviderSetParams {
  value: string | number;
  key: string;
  expiresIn?: number;
}

export interface IGenericCacheProviderHashSetParams {
  value: Object;
  key: string;
  expiresIn?: number;
}
export abstract class AbstractGenericCacheProvider {
  public abstract get(key: string): Promise<string>;
  public abstract set(data: IGenericCacheProviderSetParams): Promise<void>;
  public abstract setHash(
    data: IGenericCacheProviderHashSetParams,
  ): Promise<void>;
  public abstract getHash({
    key,
    field,
  }: {
    key: string;
    field: string;
  }): Promise<string>;
  public abstract getHashAll(key: string): Promise<Record<any, any>>;
}

export default class RedisService implements AbstractGenericCacheProvider {
  private _redisClient: Redis;

  constructor() {
    this._redisClient = new Redis(process.env.REDIS_URL);
  }

  public async get(key: string): Promise<string> {
    this._redisClient.hset('user', { teste: 1 });
    return await this._redisClient.get(key);
  }
  public async set({
    key,
    value,
    expiresIn,
  }: IGenericCacheProviderSetParams): Promise<void> {
    await this._redisClient.set(key, value, 'EX', expiresIn);
  }

  public async setHash({
    key,
    value,
    expiresIn,
  }: IGenericCacheProviderHashSetParams): Promise<void> {
    const responseRedis = await this._redisClient.hset(key, value);

    console.log({ responseRedis });
  }

  public async getHash({
    key,
    field,
  }: {
    key: string;
    field: string;
  }): Promise<string> {
    return await this._redisClient.hget(key, field);
  }

  public async getHashAll(key: string) {
    return await this._redisClient.hgetall(key);
  }
}
