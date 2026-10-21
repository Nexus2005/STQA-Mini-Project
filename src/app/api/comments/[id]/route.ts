import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const commentId = parseInt(id, 10);
    if (isNaN(commentId)) {
      return NextResponse.json({ error: 'Invalid comment ID' }, { status: 400 });
    }

    const cookie = request.cookies.get('covid_user_session');
    if (!cookie || !cookie.value) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    let user: any;
    try {
      user = JSON.parse(decodeURIComponent(cookie.value));
    } catch {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Check comment exists
    const commentRes = await query('SELECT user_id FROM comments WHERE id = $1', [commentId]);
    if (commentRes.rows.length === 0) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    const comment = commentRes.rows[0];

    // Check authorization: must be admin or comment author
    if (user.role !== 'admin' && user.id !== comment.user_id) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to delete this comment.' },
        { status: 403 }
      );
    }

    // Delete comment
    await query('DELETE FROM comments WHERE id = $1', [commentId]);

    return NextResponse.json({ success: true, message: 'Comment deleted successfully.' });
  } catch (error: any) {
    console.error('Delete comment error:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment: ' + (error.message || 'Unknown') },
      { status: 500 }
    );
  }
}
