// src/models/Entry.js
import mongoose from 'mongoose';
const entrySchema = new mongoose.Schema({
  space: { type: mongoose.Schema.Types.ObjectId, ref: 'Space', index: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['note','photo'], required: true },
  text: { type: String }, // for notes/captions
  media: [{
    public_id: String,
    url: String,
    width: Number,
    height: Number,
    format: String
  }],
  date: { type: Date, required: true }, // the “memory date”
}, { timestamps: true });

entrySchema.index({ space: 1, date: -1, _id: -1 }); // cursor pagination
export const Entry = mongoose.model('Entry', entrySchema);

