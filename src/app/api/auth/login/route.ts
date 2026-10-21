import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required fields.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Query user by email from Supabase
    const result = await query(
      'SELECT id, name, email, mobile, password_hash, role FROM users WHERE LOWER(email) = $1',
      [cleanEmail]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials. No account found with this email.' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Verify Password Hash using bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials. Password does not match.' },
        { status: 401 }
      );
    }

    // Prepare session data
    const sessionData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const response = NextResponse.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      user: sessionData,
    });

    response.cookies.set('covid_user_session', encodeURIComponent(JSON.stringify(sessionData)), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error during login: ' + (error.message || 'Unknown') },
      { status: 500 }
    );
  }
}
