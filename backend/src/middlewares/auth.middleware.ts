import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface JwtPayload {
  id: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const [, token] = authHeader.split(' ');

    const { id } = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default_secret'
    ) as JwtPayload;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    req.user = user;

    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}; 