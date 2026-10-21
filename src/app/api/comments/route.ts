import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { validateComment, sanitizeHtml } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await query(`
      SELECT 
        c.id, 
        c.comment_text, 
        c.created_at, 
        c.user_id,
        u.name as author_name, 
        u.email as author_email, 
        u.role as author_role
      FROM comments c
      JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
    `);

    return NextResponse.json({ comments: result.rows });
  } catch (error: any) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments from database: ' + (error.message || 'Unknown') },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookie = request.cookies.get('covid_user_session');
    if (!cookie || !cookie.value) {
      return NextResponse.json(
        { error: 'You must be logged in to post comments. Please login or register.' },
        { status: 401 }
      );
    }

    let user: any;
    try {
      user = JSON.parse(decodeURIComponent(cookie.value));
    } catch {
      return NextResponse.json({ error: 'Invalid user session. Please re-login.' }, { status: 401 });
    }

    const body = await request.json();
    const { comment_text } = body;

    // Validate comment input boundary & emptiness
    const check = validateComment(comment_text);
    if (!check.valid) {
      return NextResponse.json({ error: check.error }, { status: 400 });
    }

    // Apply strict HTML entity sanitization against Stored XSS
    const safeComment = sanitizeHtml(comment_text.trim());

    // Insert into Supabase comments table
    const result = await query(
      `INSERT INTO comments (user_id, comment_text) 
       VALUES ($1, $2) 
       RETURNING id, user_id, comment_text, created_at`,
      [user.id, safeComment]
    );

    const newComment = {
      ...result.rows[0],
      author_name: user.name,
      author_email: user.email,
      author_role: user.role,
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Comment posted successfully!',
        comment: newComment,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error posting comment:', error);
    return NextResponse.json(
      { error: 'Server error while saving comment: ' + (error.message || 'Unknown') },
      { status: 500 }
    );
  }
}
