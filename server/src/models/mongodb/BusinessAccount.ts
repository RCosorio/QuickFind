import mongoose from 'mongoose';
import { BusinessAccount } from '../types.js';

const businessAccountSchema = new mongoose.Schema<BusinessAccount>({
  id: { 
    type: String, 
    required: [true, 'BusinessAccount ID is required'],
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
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  businessId: {
    type: String,
    required: [true, 'Business ID is required'],
    trim: true
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

// Create index on email and businessId
businessAccountSchema.index({ email: 1 });
businessAccountSchema.index({ businessId: 1 });

// Add a pre-save hook for any additional logic (like password hashing in a real app)
businessAccountSchema.pre('save', function(next) {
  // In a real application, you would hash the password here
  // e.g., this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const BusinessAccountModel = mongoose.model<BusinessAccount>('BusinessAccount', businessAccountSchema); 