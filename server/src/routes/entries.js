import { Router } from 'express';
import { z } from 'zod';
import { authRequired } from '../middleware/auth.js';
import { Entry } from '../models/Entry.js';
import { Space } from '../models/Space.js';

const r = Router();
r.use(authRequired);

r.post('/', async (req, res) => {
  const schema = z.object({
    spaceId: z.string(),
    type: z.enum(['note', 'photo']),
    text: z.string().optional(),
    media: z.array(z.object({
      public_id: z.string(),
      url: z.string().url(),
      width: z.number().optional(),
      height: z.number().optional(),
      format: z.string().optional()
    })).default([]),
    date: z.string().optional() // ISO date
  });

  const { spaceId, type, text, media, date } = schema.parse(req.body);
  const space = await Space.findById(spaceId);
  if (!space || !space.members.some(m => m.toString() === req.user.id)) return res.status(403).json({ error: 'Forbidden' });

  const entry = await Entry.create({
    space: spaceId,
    author: req.user.id,
    type,
    text,
    media,
   date: date ? new Date(date) : new Date()
  });
  res.json(entry);
});

r.get('/', async (req, res) => {
  const schema = z.object({
    spaceId: z.string(),
    cursor: z.string().optional(), // createdAt cursor
    limit: z.string().optional()
  });
  const { spaceId, cursor, limit='15' } = schema.parse(req.query);
  const q = { space: spaceId };
  if (cursor) q.createdAt = { $lt: new Date(cursor) };

  const items = await Entry.find(q).sort({ date: -1, _id: -1 }).limit(parseInt(limit));
  const nextCursor = items.length ? items[items.length - 1].createdAt.toISOString() : null;
  res.json({ items, nextCursor });
});

export default r;

