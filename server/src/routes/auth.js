import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';

const r = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

r.post('/register', async (req, res) => {
  const { name, email, password } = registerSchema.parse(req.body);
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: 'Email in use' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });
  const token = jwt.sign({ id: user._id, email }, env.jwtSecret, { expiresIn: '7d' });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 7*24*3600*1000 });
  res.json({ user: { id: user._id, name, email } });
});

const loginSchema = registerSchema.pick({ email: true, password: true });
r.post('/login', async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) return res.status(401).json({ error: 'Invalid creds' });
  const token = jwt.sign({ id: user._id, email }, env.jwtSecret, { expiresIn: '7d' });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 7*24*3600*1000 });
  res.json({ user: { id: user._id, name: user.name, email } });
});

r.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

export default r;

