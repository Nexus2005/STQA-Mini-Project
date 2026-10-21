import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { validateName, validateEmail, validateFeedback, sanitizeHtml } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get('covid_user_session');
    if (!cookie || !cookie.value) {
      return NextResponse.json({ error: 'Unauthorized: Admin login required' }, { status: 401 });
    }

    const user = JSON.parse(decodeURIComponent(cookie.value));
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const result = await query(`
      SELECT id, user_id, name, email, message, rating, created_at 
      FROM feedback 
      ORDER BY created_at DESC
    `);

    return NextResponse.json({ feedback: result.rows });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to retrieve feedback: ' + (error.message || 'Unknown') },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, rating } = body;

    const nameCheck = validateName(name);
    if (!nameCheck.valid) {
      return NextResponse.json({ error: nameCheck.error, field: 'name' }, { status: 400 });
    }

    const emailCheck = validateEmail(email);
    if (!emailCheck.valid) {
      return NextResponse.json({ error: emailCheck.error, field: 'email' }, { status: 400 });
    }

    const msgCheck = validateFeedback(message);
    if (!msgCheck.valid) {
      return NextResponse.json({ error: msgCheck.error, field: 'message' }, { status: 400 });
    }

    const starRating = Math.min(5, Math.max(1, parseInt(rating || '5', 10)));
    const safeMessage = sanitizeHtml(message.trim());
    const safeName = name.trim();
    const safeEmail = email.trim().toLowerCase();

    // Check if user is logged in
    let userId = null;
    const cookie = request.cookies.get('covid_user_session');
    if (cookie && cookie.value) {
      try {
        const u = JSON.parse(decodeURIComponent(cookie.value));
        userId = u.id || null;
      } catch {}
    }

    const result = await query(
      `INSERT INTO feedback (user_id, name, email, message, rating) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, email, message, rating, created_at`,
      [userId, safeName, safeEmail, safeMessage, starRating]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your valuable feedback! It has been recorded.',
        feedback: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Failed to save feedback: ' + (error.message || 'Unknown') },
      { status: 500 }
    );
  }
}
