import amqp from 'amqplib';
import envConfig from '@infrastructure/config/env.config';
import { logger } from '@infrastructure/logger';

const RABBITMQ_HOST = envConfig.RABBITMQ_HOST;
const RABBITMQ_PORT = Number(envConfig.RABBITMQ_PORT);
const RABBITMQ_USER = envConfig.RABBITMQ_USER;
const RABBITMQ_PASSWORD = envConfig.RABBITMQ_PASSWORD;

export class RabbitMQConnection {
  private connection!: amqp.Connection;
  private channel!: amqp.Channel;

  constructor() {
    this.initialize();
  }

  public async initialize() {
    try {
      this.connection = await amqp.connect({
        hostname: RABBITMQ_HOST,
        port: RABBITMQ_PORT,
        username: RABBITMQ_USER,
        password: RABBITMQ_PASSWORD,
        }) as unknown as amqp.Connection;

      this.channel = await (this.connection as any).createChannel();

      this.connection.on('close', () => {
        logger.info('RabbitMQ connection closed. Reconnecting...');
        setTimeout(() => this.initialize(), 5000);
      });

      logger.info(`[RabbitMQ] Connected to ${RABBITMQ_HOST}:${RABBITMQ_PORT}`);
    } catch (error) {
      logger.error('[RabbitMQ] Connection error:', error);
      setTimeout(() => this.initialize(), 5000);
    }
  }

  public async getChannel(): Promise<amqp.Channel> {
    if (!this.channel) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return this.getChannel();
    }
    return this.channel;
  }
}
