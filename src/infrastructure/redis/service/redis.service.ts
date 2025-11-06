import { redisClientInstance } from '../redis.config';
import { RedisClientType } from 'redis';
import { logger } from '@infrastructure/logger';


/**
 * RedisService encapsulates common Redis operations in a reusable manner.
 */
class RedisService {
  private client: RedisClientType;

  constructor() {
    // Retrieve the Redis client instance from the RedisClient singleton.
    this.client = redisClientInstance.getClient();
  }


  /**
   * Sets a key with the specified data and optional expiry time.
   *
   * @param key - The key under which the data is stored.
   * @param data - The data to be stored.
   * @param expirySeconds - Optional expiry time in seconds.
   */

  public async set<T>(key: string, data: T, expirySeconds?: number): Promise<void> {
    try {
      const value = JSON.stringify(data);
      if (expirySeconds) {
        await this.client.set(key, value, { EX: expirySeconds });
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      logger.error(`Error setting key "${key}" in Redis:`, error);
      throw error;
    }
  }


  /**
   * Retrieves the data for the given key.
   *
   * @param key - The key to retrieve data for.
   * @returns The data stored for the key or null if not found.
   */

  public async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      if (!data) {
        logger.info(`REDIS : No data found for key: ${key}`);
        return null;
      }
      return JSON.parse(data) as T;
    } catch (error) {
      logger.error(`Error retrieving key "${key}" from Redis:`, error);
      throw error;
    }
  }

  /**
   * Updates the data for a given key by merging new data with the existing data.
   *
   * @param key - The key for which to update data.
   * @param updates - The partial data to merge with the current value.
   * @param expirySeconds - Optional expiry time in seconds for the updated key.
   */

  public async update<T>(key: string, updates: Partial<T>, expirySeconds?: number): Promise<void> {
    try {
      const existingData = await this.get<T>(key);
      if (!existingData) {
        throw new Error(`Key "${key}" does not exist. Cannot update non-existent data.`);
      }
      const mergedData = { ...existingData, ...updates };
      await this.set<T>(key, mergedData, expirySeconds);
    } catch (error) {
      logger.error(`Error updating key "${key}" in Redis:`, error);
      throw error;
    }
  }

  /**
   * Deletes the data for a given key.
   *
   * @param key - The key to delete.
   */
  public async delete(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      logger.error(`Error deleting key "${key}" from Redis:`, error);
      throw error;
    }
  }
}

export default RedisService;
