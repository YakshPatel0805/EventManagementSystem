import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import { isAdminEmail } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, password } = body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Automatically determine role based on email
    const role = isAdminEmail(email) ? 'admin' : 'user';

    // Create new user (in production, hash the password!)
    const user = await User.create({
      name,
      email,
      password, // In production, use bcrypt to hash this
      role
    });

    return NextResponse.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
