import mongoose from 'mongoose';
import { logger } from '../logger'; 
import envConfig from '@infrastructure/config/env.config';



mongoose.set('strictQuery', true);

export async function connectToDatabase(): Promise<void> {

  const MONGO_URI = envConfig.MONGO_URI
    
  try {
    await mongoose.connect(MONGO_URI, {});
    logger.info(`MongoDB connected at ${MONGO_URI}`);
  } catch (error) {
    console.log(error)
    logger.error(`MongoDB connection error: ${error}`);
    process.exit(1);
  }
}

/**
 * @Shutting Down the database once the server is closed
 */
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed due to application termination');
  process.exit(0);
});
