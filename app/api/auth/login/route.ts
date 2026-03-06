import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import { validateEmail, validatePassword } from '@/lib/validation';
import { addSecurityHeaders, addCORSHeaders } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    // Check rate limiting
    const rateLimitError = checkRateLimit(request);
    if (rateLimitError) return rateLimitError;

    const body = await request.json();
    const { email, password } = body;

    // Validate inputs
    if (!email || !password) {
      const response = NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
      return addSecurityHeaders(addCORSHeaders(response, request.headers.get('origin') || undefined));
    }

    if (!validateEmail(email)) {
      const response = NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
      return addSecurityHeaders(addCORSHeaders(response, request.headers.get('origin') || undefined));
    }

    if (!validatePassword(password)) {
      const response = NextResponse.json(
        { success: false, error: 'Invalid password format' },
        { status: 400 }
      );
      return addSecurityHeaders(addCORSHeaders(response, request.headers.get('origin') || undefined));
    }

    await connectDB();
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      const response = NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
      return addSecurityHeaders(addCORSHeaders(response, request.headers.get('origin') || undefined));
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      const response = NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
      return addSecurityHeaders(addCORSHeaders(response, request.headers.get('origin') || undefined));
    }

    const response = NextResponse.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

    return addSecurityHeaders(addCORSHeaders(response, request.headers.get('origin') || undefined));
  } catch (error) {
    console.error('Login error:', error);
    const response = NextResponse.json(
      { success: false, error: 'Failed to login' },
      { status: 500 }
    );
    return addSecurityHeaders(addCORSHeaders(response, request.headers.get('origin') || undefined));
  }
}
