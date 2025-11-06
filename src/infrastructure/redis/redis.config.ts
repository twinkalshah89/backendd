import envConfig from '@infrastructure/config/env.config';
import { logger } from '@infrastructure/logger';
import { createClient, RedisClientType } from 'redis';

class RedisClient {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: envConfig.REDIS_CONNECTION_URL,
    });

    this.client.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });
  }

  /**
   * Connects to Redis server
   */
  public async connect(): Promise<void> {
    try {
      await this.client.connect();
      logger.info('Redis connected successfully');
    } catch (error) {
      logger.error('Error connecting to Redis:', error);
    }
  }

  /**
   * Gets the Redis client instance
   */
  public getClient(): RedisClientType {
    return this.client;
  }
}

export const redisClientInstance = new RedisClient();
