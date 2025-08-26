import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { Space } from '../models/Space.js';
import crypto from 'crypto';
import { z } from 'zod';

const r = Router();
r.use(authRequired);

r.post('/', async (req, res) => {
  const schema = z.object({ name: z.string().min(2), relationshipStart: z.string().optional() });
  const { name, relationshipStart } = schema.parse(req.body);
  const joinToken = crypto.randomBytes(16).toString('hex');
  const space = await Space.create({
    name,
    members: [req.user.id],
    relationshipStart: relationshipStart ? new Date(relationshipStart) : undefined,
    joinToken
  });
  res.json(space);
});

r.get('/', async (req, res) => {
  const spaces = await Space.find({ members: req.user.id });
  res.json(spaces);
});

r.post('/join', async (req, res) => {
  const schema = z.object({ token: z.string() });
  const { token } = schema.parse(req.body);
  const space = await Space.findOne({ joinToken: token });
  if (!space) return res.status(404).json({ error: 'Invalid token' });
  if (!space.members.includes(req.user.id)) {
    space.members.push(req.user.id);
    await space.save();
  }
  res.json(space);
});

export default r;

