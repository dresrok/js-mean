import { Schema, model, Document } from 'mongoose';

// Interface for User
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
}

// Schema Definition
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Por favor agrega un nombre'],
    },
    email: {
      type: String,
      required: [true, 'Por favor agrega un correo electrónico'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Por favor agrega una contraseña'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// Model
export const User = model<IUser>('User', userSchema);
