import dotenv from 'dotenv';
import path from 'path';


dotenv.config()
const env = process.env.NODE_ENV || "development";
dotenv.config({ path: path.resolve(__dirname, `../../../.env.${env}`)});

const requiredEnvVars = [
    "PORT",
    "NODE_ENV",
    "MONGO_URI",
  
    //JWT
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",

    //REDIS
    "REDIS_CONNECTION_URL",

    
    //RABBITMQ
    "RABBITMQ_HOST",
    "RABBITMQ_PORT",
    "RABBITMQ_USER",
    "RABBITMQ_PASSWORD",
    "RABBITMQ_VHOST",
    "CORS_WHITELIST",


  ];

    for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  // Parse CORS whitelist (JSON array or comma-separated)
  function parseJsonArray(raw: string | undefined): string[] {
  if (!raw) return [];
  const text = raw.trim();
  if (text.startsWith("[") && text.endsWith("]")) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) return parsed.map(String);
      throw new Error("JSON must be an array");
    } catch {
      // fall back to CSV parsing below
    }
  }
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  }

  const parsedCorsWhitelist = parseJsonArray(process.env.CORS_WHITELIST);


    export default {
    PORT: Number(process.env.PORT),
    NODE_ENV: process.env.NODE_ENV,
    MONGO_URI:process.env.MONGO_URI as string,

    REDIS_CONNECTION_URL:process.env.REDIS_CONNECTION_URL as string,
    
  
    // JWT
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,

    //RABBITMQ
    RABBITMQ_HOST: process.env.RABBITMQ_HOST,
    RABBITMQ_PORT: process.env.RABBITMQ_PORT,
    RABBITMQ_USER: process.env.RABBITMQ_USER,
    RABBITMQ_PASSWORD: process.env.RABBITMQ_PASSWORD,
    CORS_WHITELIST: parsedCorsWhitelist

  };