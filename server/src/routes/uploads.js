// routes/uploads.js
import { Router } from 'express';
import crypto from 'crypto';
import { env } from '../config/env.js';
import { authRequired } from '../middleware/auth.js';

const r = Router();

r.post('/signature', authRequired, async (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const paramsToSign = `timestamp=${timestamp}&upload_preset=memoire_secure${env.cloud.secret}`;
  const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');
  res.json({ timestamp, signature, cloudName: env.cloud.name, apiKey: env.cloud.key, uploadPreset: 'memoire_secure' });
});

export default r;

