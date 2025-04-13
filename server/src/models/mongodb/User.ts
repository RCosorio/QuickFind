import mongoose from 'mongoose';
import { User, UserRole } from '../types.js';

const userSchema = new mongoose.Schema<User>({
  id: { 
    type: String, 
    required: [true, 'User ID is required'],
    unique: true,
    trim: true
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email']
  },
  firstName: { 
    type: String, 
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters']
  },
  lastName: { 
    type: String, 
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters']
  },
  role: { 
    type: String, 
    enum: {
      values: ['student'],
      message: '{VALUE} is not a valid role'
    },
    required: [true, 'Role is required'],
    default: 'student'
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  }
}, { 
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

// Create index on email
userSchema.index({ email: 1 });

// Add a pre-save hook for any additional logic (like password hashing in a real app)
userSchema.pre('save', function(next) {
  // In a real application, you would hash the password here
  // e.g., this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const UserModel = mongoose.model<User>('User', userSchema); 