import bcrypt from 'bcryptjs';
import { Schema, Types, model, type Document } from 'mongoose';

// Roles disponibles en el sistema de gestión de incidentes.
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

// Número de rondas de sal para bcrypt al hashear contraseñas.
export const PASSWORD_SALT_ROUNDS = 10;

// Representación saneada de un usuario sin campos sensibles.
export interface UserRecord {
  _id: string;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

// Schema de Mongoose con validaciones y hooks para usuarios.
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

// Hook pre-save que hashea la contraseña solo si ha sido modificada.
userSchema.pre<UserDocument>('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  this.password = await bcrypt.hash(this.password, PASSWORD_SALT_ROUNDS);
});

// ÍNDICE: Para queries que filtran por rol y estado activo
// Uso: Obtener lista de todos los agents activos (común en selects)
// Query: find({ role: 'agent', isActive: true })
userSchema.index({ role: 1, isActive: 1 });

// Modelo de Mongoose para operaciones CRUD sobre usuarios.
export const UserModel = model<UserDocument>('User', userSchema);

// Representación plana que obtenemos con consultas lean.
export type UserDocumentLean = {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  password: string;
  __v?: number;
};

export function toUserRecord(user: UserDocumentLean): UserRecord {
  // Sanitiza el documento lean antes de exponerlo a consumidores externos.
  const { _id, password: _password, __v: _version, ...rest } = user;

  return {
    _id: _id.toString(),
    fullName: rest.fullName,
    email: rest.email,
    role: rest.role,
    isActive: rest.isActive,
  };
}

export type UserCreateRequest = {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
};