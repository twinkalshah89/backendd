import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, JwtPayload, NotBeforeError, TokenExpiredError } from "jsonwebtoken";
import envConfig from "@infrastructure/config/env.config";



declare global {
    namespace Express {
      interface Request {
        userId:string
      }
    }
  }


export class JWTUserMiddleware {

    private static userTokenSecret = String(envConfig.ACCESS_TOKEN_SECRET);
    
    public static validateAccessToken(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            res.status(401).json({ message: "Access token is missing or malformed", jwtError: true });
            return;
        }

        const token = authHeader.split(" ")[1];
        jwt.verify(token, JWTUserMiddleware.userTokenSecret, (err: any, decoded: any) => {
            if (err) {
                if (err instanceof TokenExpiredError) {
                    res.status(401).json({ message: "Access token has expired", jwtError: true });
                    return;
                }
                if (err instanceof JsonWebTokenError) {
                    res.status(401).json({ message: "Invalid access token", jwtError: true });
                    return;
                }
                if (err instanceof NotBeforeError) {
                    res.status(401).json({ message: "Access token not yet valid", jwtError: true });
                    return;
                }
                res.status(401).json({ message: "Could not validate access token", jwtError: true });
                return;
            }

            const payload = decoded as JwtPayload;
            if (!payload?.userId) {
                res.status(401).json({ message: "Invalid access token payload", jwtError: true });
                return;
            }
            req.userId = payload.userId;
            next();
        });
    }

}
