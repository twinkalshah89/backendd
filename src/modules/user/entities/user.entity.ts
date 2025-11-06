export interface UserDocument extends Document {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}
  