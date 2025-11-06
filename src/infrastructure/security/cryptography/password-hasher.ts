import argon2 from "argon2";

export class PasswordHasher {
    
    static async hashPassword(password: string): Promise<string> {
        return await argon2.hash(password);
    }

    static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await argon2.verify(hashedPassword, password);
    }
}
