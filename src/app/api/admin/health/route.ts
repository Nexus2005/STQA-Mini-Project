import { NextResponse } from 'next/server';
import { getDbHealth } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const health = await getDbHealth();
  return NextResponse.json(health);
}
