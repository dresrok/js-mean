import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';

interface JwtPayload {
  id: string;
}

// Extender Express Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Obtener token del header
      token = req.headers.authorization.split(' ')[1];

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;

      // Obtener usuario del token (excluyendo password)
      req.user = (await User.findById(decoded.id).select('-password')) as IUser;

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'No autorizado' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No autorizado, no hay token' });
  }
};
