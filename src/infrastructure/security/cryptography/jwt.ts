import jwt, { JwtPayload } from 'jsonwebtoken';
import envConfig from '@infrastructure/config/env.config'; 
import { AuthorizeError, BadRequestError } from '@infrastructure/errors';


export class JWTGenerator {
    private accessTokenSecret: string;
    private refreshTokenSecret: string;


    constructor() {
        this.accessTokenSecret = String(envConfig.ACCESS_TOKEN_SECRET);
        this.refreshTokenSecret = String(envConfig.REFRESH_TOKEN_SECRET);
    }

    public generateAccessToken(data: object): string {
        return jwt.sign(data, this.accessTokenSecret, { expiresIn: "7d" });
    }

    public generateRefreshToken(data: object): string {
        return jwt.sign(data, this.refreshTokenSecret, { expiresIn: "7d" });
    }


    public verifyRefreshToken(refreshToken:string){
        
        try {
            const decoded = jwt.verify(refreshToken, this.refreshTokenSecret);
            
            if (typeof decoded === "string") {
                throw new AuthorizeError("Invalid token format");
            }

            return decoded as JwtPayload;
        } catch (error) {
            throw new AuthorizeError("Invalid Refresh Token")
        }
    }
}
