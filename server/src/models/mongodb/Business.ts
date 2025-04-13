import mongoose from 'mongoose';
import { Business, BusinessType, Review } from '../types.js';

const businessSchema = new mongoose.Schema<Business>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  ownerEmail: { type: String, required: true },
  businessType: { type: String, enum: ['housing', 'restaurant', 'store'], required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  contactInfo: { type: String, required: true },
  rating: { type: Number },
  reviews: [{
    id: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number },
    comment: { type: String, required: true },
    date: { type: String, required: true },
    businessId: { type: String, required: true },
    ownerReply: String,
    ownerReplyDate: String
  }],
  photos: [String],
  businessHours: { type: Map, of: String },
  menu: [{
    id: String,
    name: String,
    description: String,
    price: Number,
    category: String,
    available: Boolean,
    photo: String
  }],
  items: [{
    id: String,
    name: String,
    description: String,
    price: Number,
    category: String,
    inStock: Boolean,
    photo: String
  }],
  rooms: [{
    id: String,
    name: String,
    description: String,
    price: Number,
    bedrooms: Number,
    bathrooms: Number,
    available: Boolean,
    photos: [String],
    amenities: [String]
  }]
}, { 
  timestamps: true,
  toJSON: { 
    transform: (_, ret) => {
      // Convert businessHours Map to object if it exists
      if (ret.businessHours instanceof Map) {
        ret.businessHours = Object.fromEntries(ret.businessHours);
      }
      return ret;
    }
  }
});

export const BusinessModel = mongoose.model<Business>('Business', businessSchema); 