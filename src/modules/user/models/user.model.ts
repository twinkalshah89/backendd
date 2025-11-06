import { UserDocument } from "../entities/user.entity";
import mongoose, { Schema, Model } from "mongoose";

const UserSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { strict: false, timestamps: true }
);

const UserModel: Model<UserDocument> = mongoose.model<UserDocument>("User",UserSchema);

export default UserModel;