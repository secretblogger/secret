import mongoose, { Schema, Document } from 'mongoose';
import bcryptjs from 'bcryptjs';

interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (!this.password) return next();

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (password: string) {
  if (!this.password) return false;
  return await bcryptjs.compare(password, this.password);
};

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
