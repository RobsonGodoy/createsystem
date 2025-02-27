import { Router } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    const user = await User.create({ name, email, password });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' }
    );

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router; 