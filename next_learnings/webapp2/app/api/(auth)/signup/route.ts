import { NextRequest, NextResponse } from 'next/server';
// POST: Create data
export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({
    message: 'POST: Data received successfully!',
    data: body,
  });
}