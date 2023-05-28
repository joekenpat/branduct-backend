import { Model, model, Schema } from "mongoose";
import { IUserDocument } from "../dtos/User";

const UserSchema = new Schema<IUserDocument>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: false, default: null },
  password: { type: String, required: true, min: 8, max: 18 },
  state: { type: String, required: false, default: null },
  lga: { type: String, required: false, default: null },
  address: { type: String, required: false, default: null },
  isActive: { type: Boolean, required: true, default: true },
  isAdmin: { type: Boolean, required: true, default: false },
},
{
  timestamps: true,
  collection: 'users',
  toObject: {
    versionKey: false
  }
});

export const UserModel: Model<IUserDocument> = model<IUserDocument>('User', UserSchema);
