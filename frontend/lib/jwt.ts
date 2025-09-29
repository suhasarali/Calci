// lib/jwt.ts
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export interface JWTPayload {
  userId: number;
  email: string;
  phone: string;
  iat?: number;
  exp?: number;
}

// Verify JWT token
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

// Extract token from request headers
export const extractToken = (request: NextRequest): string | null => {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
};

// Middleware to verify authentication
export const authenticateUser = (request: NextRequest): JWTPayload | null => {
  const token = extractToken(request);
  if (!token) {
    return null;
  }
  return verifyToken(token);
};
