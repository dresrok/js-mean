import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { TokenPayload } from '../models/auth.models';

// Generar Token JWT
const generateToken = (payload: TokenPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Por favor complete todos los campos' });
  }

  // Verificar si el usuario existe
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'El usuario ya existe' });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Crear usuario
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken({ id: user.id, name: user.name, email: user.email }),
      role: user.role,
    });
  } else {
    res.status(400).json({ message: 'Datos de usuario inválidos' });
  }
};

// @desc    Autenticar usuario
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Verificar usuario
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password || ''))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken({ id: user.id, name: user.name, email: user.email }),
      role: user.role,
    });
  } else {
    res.status(400).json({ message: 'Credenciales inválidas' });
  }
};
