import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get('covid_user_session');
    if (!cookie || !cookie.value) {
      return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
    }

    const user = JSON.parse(decodeURIComponent(cookie.value));
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const result = await query(
      'SELECT id, name, email, mobile, role, created_at FROM users ORDER BY created_at DESC'
    );

    return NextResponse.json({ users: result.rows });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch users: ' + (error.message || 'Unknown') },
      { status: 500 }
    );
  }
}
