import mongoose from 'mongoose';
import { Review } from '../types.js';

const reviewSchema = new mongoose.Schema<Review>({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  rating: { type: Number },
  comment: { type: String, required: true },
  date: { type: String, required: true },
  businessId: { type: String, required: true },
  ownerReply: String,
  ownerReplyDate: String
}, { timestamps: true });

export const ReviewModel = mongoose.model<Review>('Review', reviewSchema); 