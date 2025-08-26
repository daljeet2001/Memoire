import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env.js';

cloudinary.config({
  cloud_name: env.cloud.name,
  api_key: env.cloud.key,
  api_secret: env.cloud.secret
});

export { cloudinary };

