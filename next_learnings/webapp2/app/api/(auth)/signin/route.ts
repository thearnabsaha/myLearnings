import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'
// POST: api/signin
export async function POST(request: NextRequest) {
  const body = await request.json();
  const user=await prisma.user.findFirst({
    where: {
      username: body.username,
    },
  })
  if(user){
    
  }
  console.log(user)
  return NextResponse.json({
    message: 'POST: Data received successfully!',
    data: body,
  });
}