import { NextRequest, NextResponse } from 'next/server';
import { query, getDbHealth } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get('covid_user_session');
    if (!cookie || !cookie.value) {
      return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
    }

    const user = JSON.parse(decodeURIComponent(cookie.value));
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Requires administrator privileges' }, { status: 403 });
    }

    const [usersRes, commentsRes, feedbackRes, testsRes, health] = await Promise.all([
      query('SELECT count(*) as count FROM users'),
      query('SELECT count(*) as count FROM comments'),
      query('SELECT count(*) as count FROM feedback'),
      query('SELECT count(*) as count FROM test_runs'),
      getDbHealth(),
    ]);

    const recentUsers = await query(
      'SELECT id, name, email, mobile, role, created_at FROM users ORDER BY created_at DESC LIMIT 5'
    );

    const recentComments = await query(`
      SELECT c.id, c.comment_text, c.created_at, u.name as author_name, u.email as author_email
      FROM comments c
      JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
      LIMIT 5
    `);

    return NextResponse.json({
      counts: {
        users: parseInt(usersRes.rows[0]?.count ?? '0', 10),
        comments: parseInt(commentsRes.rows[0]?.count ?? '0', 10),
        feedback: parseInt(feedbackRes.rows[0]?.count ?? '0', 10),
        testRuns: parseInt(testsRes.rows[0]?.count ?? '0', 10),
      },
      health,
      recentUsers: recentUsers.rows,
      recentComments: recentComments.rows,
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to load admin stats: ' + (error.message || 'Unknown') },
      { status: 500 }
    );
  }
}
