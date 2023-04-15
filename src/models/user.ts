import * as mongoose from 'mongoose';

export const User = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
});
