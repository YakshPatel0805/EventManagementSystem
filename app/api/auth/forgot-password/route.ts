import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, oldPassword, newPassword } = await request.json();

    if (!email || !oldPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Email, old password, and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify old password (assuming password is stored as plain text or use your existing auth method)
    if (user.password !== oldPassword) {
      return NextResponse.json(
        { success: false, error: 'Old password is incorrect' },
        { status: 401 }
      );
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return NextResponse.json(
      { success: true, message: 'Password changed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to change password' },
      { status: 500 }
    );
  }
}
