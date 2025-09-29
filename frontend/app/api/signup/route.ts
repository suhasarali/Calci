// app/api/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query, ready } from "@/lib/database"; // 👈 ensure ready is awaited
import { sendOTP } from "@/lib/otp-service";

export async function POST(request: NextRequest) {
  try {
    // ✅ Wait for database initialization
    await ready;

    const { email, name, phone, password } = await request.json();

    // --- Validation ---
    if (!email || !name || !phone || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: "Invalid phone number format. Please enter 10 digits." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // --- Check if user already exists ---
    const existingUser = await query(
      "SELECT id FROM users WHERE email = $1 OR phone = $2",
      [email, phone]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: "User with this email or phone already exists" },
        { status: 409 }
      );
    }

    // --- Hash password ---
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // --- Send OTP via Twilio ---
    const otpResult = await sendOTP(phone);
    if (!otpResult.success) {
      return NextResponse.json(
        { error: otpResult.error || "Failed to send OTP. Please try again." },
        { status: 500 }
      );
    }

    // --- Store temp user ---
    await query(
      `INSERT INTO temp_users (email, name, phone, password_hash)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (phone)
       DO UPDATE SET email = EXCLUDED.email, name = EXCLUDED.name, password_hash = EXCLUDED.password_hash`,
      [email, name, phone, passwordHash]
    );

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully. Please verify your phone number.",
      tempData: { email, name, phone },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
