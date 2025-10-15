// app/api/users/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

// No longer need JWT since we are making this public
// import jwt from 'jsonwebtoken'; 

export async function GET(request: NextRequest) {
  try {
    // --- REMOVED THE ENTIRE TOKEN VERIFICATION BLOCK ---
    // The code that checked for the 'Authorization' header has been deleted.

    const sqlQuery = `
      SELECT
        u.id,
        u.name,
        u.email,
        u.phone,
        COALESCE(
          ARRAY_AGG(c.name) FILTER (WHERE c.name IS NOT NULL),
          '{}'
        ) as "calculatorsUsed"
      FROM
        users u
      LEFT JOIN
        user_calculator_usage ucu ON u.id = ucu.user_id
      LEFT JOIN
        calculators c ON ucu.calculator_id = c.id
      GROUP BY
        u.id
      ORDER BY
        u.created_at DESC;
    `;

    const result = await query(sqlQuery);

    return NextResponse.json({ users: result.rows });

  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}