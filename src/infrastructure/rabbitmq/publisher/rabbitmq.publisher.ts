import * as amqp from 'amqplib';
import { logger } from '@infrastructure/logger';
import { RabbitMQConnection } from '@infrastructure/rabbitmq/connection/rabbitmq.connection';




export class RabbitMQPublisher {

  private connection: RabbitMQConnection;
  private channel!: amqp.Channel;

  constructor() {
    this.connection = new RabbitMQConnection();
  }

  /**
   * Publishes a given message to an array of queues.
   *
   * @param queues - An array of queue names to which the message should be published.
   * @param message - The message to be published. It could be a string, object, etc.
   */

  public async publishToQueues(queue: string, message: any): Promise<void> {
    const payload = Buffer.from(JSON.stringify(message));
    
    try {
        this.channel = await this.connection.getChannel();
        await this.channel.assertQueue(queue, { durable: true });        
        const isSent = this.channel.sendToQueue(queue, payload);
        if (isSent) logger.info(`[RabbitMQ] Message published to queue: ${queue}`);
        else logger.error(`[RabbitMQ] Failed to publish message to queue: ${queue}`);
    } catch (error) {
      logger.error('[RabbitMQ] Error in publishing messages:', error);
    }
  }
}
