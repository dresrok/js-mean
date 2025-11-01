import { Schema, model, type Document } from 'mongoose';

export type UserRole = 'reporter' | 'agent' | 'admin';

// Documento de Mongoose que representa a los usuarios disponibles en el sistema.
export interface UserDocument extends Document {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    fullName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['reporter', 'agent', 'admin'] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const UserModel = model<UserDocument>('User', userSchema);
