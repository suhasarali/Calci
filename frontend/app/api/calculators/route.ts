// app/api/calculators/usage/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: number;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate the user from their token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    
    let decoded: TokenPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    const userId = decoded.userId;

    // 2. Get the name of the calculator used from the request body
    const { calculatorName } = await request.json();
    if (!calculatorName) {
      return NextResponse.json({ error: 'calculatorName is required' }, { status: 400 });
    }

    // 3. Find the ID for the given calculator name
    const calcResult = await query('SELECT id FROM calculators WHERE name = $1', [calculatorName]);
    if (calcResult.rows.length === 0) {
      return NextResponse.json({ error: `Calculator '${calculatorName}' not found` }, { status: 404 });
    }
    const calculatorId = calcResult.rows[0].id;

    // 4. Insert the record into the usage table
    await query(
      `INSERT INTO user_calculator_usage (user_id, calculator_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, calculator_id) DO NOTHING`, // Prevents duplicate entries
      [userId, calculatorId]
    );

    return NextResponse.json({ success: true, message: 'Usage recorded' });

  } catch (error) {
    console.error('Error recording calculator usage:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}