import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const authRequired = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, env.jwtSecret);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

