import { NextRequest, NextResponse } from 'next/server';

// GET: Fetch data
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'GET: Hello from API!',
    timestamp: new Date().toISOString(),
  });
}

// POST: Create data
export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({
    message: 'POST: Data received successfully!',
    data: body,
  });
}

// PUT: Update data
export async function PUT(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({
    message: 'PUT: Data updated!',
    data: body,
  });
}

// DELETE: Delete data
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  return NextResponse.json({
    message: `DELETE: Deleted item with id id`
  });
}