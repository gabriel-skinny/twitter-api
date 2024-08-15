import Redis from 'ioredis';
import {
  AbstractGenericCacheProvider,
  IGenericCacheProviderSetParams,
} from './cacheService';

export default class RedisService implements AbstractGenericCacheProvider {
  private _redisClient: Redis;

  constructor() {
    this._redisClient = new Redis(process.env.REDIS_URL);
  }

  public async get(key: string): Promise<string> {
    return await this._redisClient.get(key);
  }
  public async set({
    key,
    value,
    expiresIn,
  }: IGenericCacheProviderSetParams): Promise<void> {
    await this._redisClient.set(key, value, 'EX', expiresIn);
  }
}
