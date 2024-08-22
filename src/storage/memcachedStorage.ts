import Memcached from 'memcached';
import { IStorage } from '../contracts';

export class MemcachedStorage implements IStorage {
    private memcachedClient: Memcached;
    private timeout: number;

    constructor(memcachedClient: Memcached, timeout: number) {
        this.memcachedClient = memcachedClient;
        this.timeout = timeout
    }

    async get<T>(key: string | number): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.memcachedClient.get(String(key), (err, data) => {
                if (err) {
                    console.error('Failed to get data:', err);
                    return reject(new Error('Failed to get data'));
                }
                if (data === undefined) {
                    return reject(new Error('Key not found'));
                }
                try {
                    resolve(JSON.parse(data) as T);
                } catch (error) {
                    console.error('Failed to deserialize data:', error);
                    reject(new Error('Failed to deserialize data'));
                }
            });
        });
    }

    async set<T>(key: string | number, item: T): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const serializedValue = JSON.stringify(item);
            this.memcachedClient.set(String(key), serializedValue, this.timeout, (err) => {
                if (err) {
                    console.error('Failed to set data:', err);
                    return reject(new Error('Failed to set data'));
                }
                resolve(item);
            });
        });
    }

}