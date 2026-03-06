import { NextRequest, NextResponse } from 'next/server';

// Simple JWT-like token validation (in production, use proper JWT library)
export const verifyAuth = (request: NextRequest): { valid: boolean; userId?: string } => {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { valid: false };
    }

    const token = authHeader.substring(7);
    
    // In production, verify JWT signature and expiration
    // For now, just check if token exists and is not empty
    if (!token || token.length < 10) {
      return { valid: false };
    }

    return { valid: true, userId: token };
  } catch (error) {
    return { valid: false };
  }
};

export const requireAuth = (request: NextRequest): NextResponse | null => {
  const auth = verifyAuth(request);
  
  if (!auth.valid) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return null;
};

export const addSecurityHeaders = (response: NextResponse): NextResponse => {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  return response;
};

export const addCORSHeaders = (response: NextResponse, origin?: string): NextResponse => {
  // Whitelist allowed origins (configure based on your needs)
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.NEXT_PUBLIC_APP_URL || ''
  ];

  const requestOrigin = origin || '';
  
  if (allowedOrigins.includes(requestOrigin)) {
    response.headers.set('Access-Control-Allow-Origin', requestOrigin);
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');

  return response;
};
