import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

interface ApiError extends Error {
  statusCode?: number;
  errors?: Record<string, any>;
  code?: number;
  keyValue?: Record<string, any>;
}

export const errorHandler = (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  console.error('Error:', err);
  
  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server Error';
  let errors = err.errors || {};
  
  // Handle Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.fromEntries(
      Object.entries(err.errors).map(([key, error]) => [
        key,
        error.message
      ])
    );
  }
  
  // Handle Mongoose duplicate key errors
  if (err.code === 11000 && err.keyValue) {
    statusCode = 409;
    message = 'Duplicate field value entered';
    const field = Object.keys(err.keyValue)[0];
    errors = { [field]: `The ${field} already exists` };
  }
  
  // Handle Mongoose cast errors (invalid IDs, etc.)
  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = 'Invalid input data';
    errors = { [err.path]: `${err.value} is not a valid ${err.kind}` };
  }
  
  return res.status(statusCode).json({
    success: false,
    message,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

export default errorHandler; 