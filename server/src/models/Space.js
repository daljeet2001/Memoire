// src/models/Space.js
import mongoose from 'mongoose';
const spaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  relationshipStart: { type: Date },
  joinToken: { type: String, index: true }, // for invite links
  coverImage: { type: String }, // Cloudinary URL
}, { timestamps: true });

export const Space = mongoose.model('Space', spaceSchema);

