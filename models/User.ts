import mongoose from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  image?: string;
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    emailVerified: { type: Date },
  },
  { timestamps: true }
);

// Prevent model recompilation in development
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;