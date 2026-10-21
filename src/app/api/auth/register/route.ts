import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { validateName, validateEmail, validateMobile, validatePassword } from '@/lib/validation';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, mobile, password } = body;

    // 1. Strict Server-side Regex & Boundary Validations
    const nameCheck = validateName(name);
    if (!nameCheck.valid) {
      return NextResponse.json({ error: nameCheck.error, field: 'name' }, { status: 400 });
    }

    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      return NextResponse.json({ error: emailCheck.error, field: 'email' }, { status: 400 });
    }

    const mobileCheck = validateMobile(mobile);
    if (!mobileCheck.valid) {
      return NextResponse.json({ error: mobileCheck.error, field: 'mobile' }, { status: 400 });
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      return NextResponse.json({ error: passwordCheck.error, field: 'password' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanMobile = mobile.trim();

    // 2. Check for Duplicate Email in Supabase Database
    const existing = await query('SELECT id FROM users WHERE LOWER(email) = $1', [cleanEmail]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please login or use another email.', field: 'email' },
        { status: 409 }
      );
    }

    // 3. Hash Password using bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 4. Insert into Supabase 'users' table
    const result = await query(
      `INSERT INTO users (name, email, mobile, password_hash, role) 
       VALUES ($1, $2, $3, $4, 'user') 
       RETURNING id, name, email, mobile, role, created_at`,
      [cleanName, cleanEmail, cleanMobile, passwordHash]
    );

    const newUser = result.rows[0];

    // 5. Create Session Cookie
    const sessionData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    const response = NextResponse.json(
      {
        success: true,
        message: 'Registration successful! Welcome to the COVID-19 Awareness Portal.',
        user: sessionData,
      },
      { status: 201 }
    );

    // Store session cookie (URL-encoded JSON)
    response.cookies.set('covid_user_session', encodeURIComponent(JSON.stringify(sessionData)), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { error: 'Internal server error while processing registration: ' + (error.message || 'Unknown') },
      { status: 500 }
    );
  }
}
