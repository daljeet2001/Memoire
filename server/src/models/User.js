// src/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, index: true },
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true });

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

export const User = mongoose.model('User', userSchema);

