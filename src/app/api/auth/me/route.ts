import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get('covid_user_session');
  if (!cookie || !cookie.value) {
    return NextResponse.json({ user: null });
  }

  try {
    const user = JSON.parse(decodeURIComponent(cookie.value));
    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ user: null });
  }
}
