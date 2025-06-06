import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt';

// POST: api/signin
import { z } from 'zod';
const schema = z.object({
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
  try {
    if (!result.success) {
      return NextResponse.json({
        message: result.error.format(),
      });
    }
    const user = await prisma.user.findFirst({
      where: {
        username: body.username,
      },
    })

    if (!user) {
      return NextResponse.json({
        message: 'User Doesnt Exists',
      });
    } else {
      const match = await bcrypt.compare(body.password, user.password);
      if (!match) {
        return NextResponse.json({
          message: 'Wrong Password',
        });
      } else {
        return NextResponse.json({
          message: 'Sign In Successfully',
        });
      }
    }
  } catch (error) {
    return NextResponse.json({
      message: error,
    });
  }
}