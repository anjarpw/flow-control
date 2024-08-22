import { RedisClientType } from 'redis';
import { IStorage } from '../contracts';

export class RedisStorage implements IStorage {
  private redisClient: RedisClientType;

  constructor(redisClient: RedisClientType) {
    this.redisClient = redisClient;
  }

  async get<T>(key: string | number): Promise<T> {
    const rawValue = await this.redisClient.get(String(key));
    if (rawValue) {
      try {
        return JSON.parse(rawValue) as T;
      } catch (error) {
        console.error('Failed to deserialize data:', error);
        throw new Error('Failed to deserialize data');
      }
    }
    throw new Error('Key not found');
  }

  async set<T>(key: string | number, item: T): Promise<T> {
    const serializedValue = JSON.stringify(item);
    await this.redisClient.set(String(key), serializedValue);
    return item;
  }
}
