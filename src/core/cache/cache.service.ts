import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject, OnModuleDestroy } from '@nestjs/common';
import type { Cache } from 'cache-manager';

interface RedisStore {
  getClient?: () => {
    quit: () => void;
  };
}

@Injectable()
export class CacheService implements OnModuleDestroy {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    return await this.cache.get<T>(key);
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    await this.cache.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    await this.cache.del(key);
  }

  onModuleDestroy(): void {
    const cacheWithStore = this.cache as Cache & { store?: RedisStore };
    if (cacheWithStore.store?.getClient) {
      const redisClient = cacheWithStore.store.getClient();
      redisClient.quit();
    }
  }
}
