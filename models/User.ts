import mongoose, { Schema, model, models } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
  },
  { timestamps: true }
);

// Index for login queries
UserSchema.index({ email: 1 });

const User = models.User || model<IUser>('User', UserSchema);

export default User;
