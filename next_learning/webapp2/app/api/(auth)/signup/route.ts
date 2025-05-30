import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
// POST: api/signup
import { z } from 'zod';
const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters long' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[@$!%*?&]/, { message: 'Password must contain at least one special character' }),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = schema.safeParse(body);
  const hashedPassword = await bcrypt.hash(body.password, 10);
  try {
    if (!result.success) {
      return NextResponse.json({
        message: result.error.format(),
      });
    }
    const user=await prisma.user.findFirst({
      where: {
        OR: [
          { username: body.username },
          { email: body.email },
        ],
      },
    })
    if(!user){
      await prisma.user.create({
        data: {
          username: body.username,
          email: body.email,
          password:hashedPassword
        },
      })
      return NextResponse.json({
        message: 'Sign Up Successfully!',
      });
    }
    return NextResponse.json({
      message: 'User Already Exists',
    });
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      message: error,
    });
  }
}