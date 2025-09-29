// app/api/verify-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import { verifyOTP } from '@/lib/otp-service';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { error: 'Phone and OTP are required' },
        { status: 400 }
      );
    }

    // Verify OTP using Twilio Verify API
    const otpResult = await verifyOTP(phone, otp);
    if (!otpResult.success) {
      return NextResponse.json(
        { error: otpResult.error || 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Get temporary user data
    const tempUserResult = await query(
      'SELECT * FROM temp_users WHERE phone = $1',
      [phone]
    );

    if (tempUserResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User data not found. Please try signing up again.' },
        { status: 400 }
      );
    }

    const tempUser = tempUserResult.rows[0];

    // Create user account
    const userResult = await query(
      'INSERT INTO users (email, name, phone, password_hash, phone_verified) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, phone, phone_verified, created_at',
      [tempUser.email, tempUser.name, tempUser.phone, tempUser.password_hash, true]
    );

    const user = userResult.rows[0];

    // Clean up temporary data
    await query('DELETE FROM temp_users WHERE phone = $1', [phone]);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        phone: user.phone 
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        phone_verified: user.phone_verified
      },
      token
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
