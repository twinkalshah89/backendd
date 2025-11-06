import rateLimit from "express-rate-limit";
import { Request } from "express";
import jwt from "jsonwebtoken";
import envConfig from "@infrastructure/config/env.config";

const internalTokenSecret = String(envConfig.INTERNAL_JWT_SECRET);
/**
 * @rateLimit - BLOCK IP if more than 2000 Request in 10min
 */

const rateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 10, 
    message: 'Too many requests from this IP, please try again later. error from service',

     // 👇 Custom skip logic
   skip:(req: Request): boolean => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return false;
      }
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, internalTokenSecret) as any
      return !!decoded?.service;
    } catch {
      return false;
    }
  },
  
  });

   

export default rateLimiter;