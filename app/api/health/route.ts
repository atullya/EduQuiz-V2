import { NextResponse } from 'next/server';

export const runtime = 'edge'; // optional: remove if you need Node-only APIs

export async function GET() {
  return NextResponse.json(
    { status: 'healthy', timestamp: new Date().toISOString() },
    {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    }
  );
}
