// app/api/verify-token/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/jwt';
import { query } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const payload = authenticateUser(request);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or missing token' },
        { status: 401 }
      );
    }

    // Get user data from database
    const userResult = await query(
      'SELECT id, email, name, phone, phone_verified FROM users WHERE id = $1',
      [payload.userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        phone_verified: user.phone_verified
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
