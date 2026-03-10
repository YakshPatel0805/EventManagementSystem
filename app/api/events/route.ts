import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Event from '@/models/Event';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const cursor = searchParams.get('cursor');
    
    let query: any = {};
    
    if (cursor) {
      query._id = { $gt: cursor };
    }
    
    const events = await Event.find(query)
      .sort({ _id: 1 })
      .limit(limit + 1);
    
    const hasMore = events.length > limit;
    const data = hasMore ? events.slice(0, limit) : events;
    const nextCursor = hasMore ? data[data.length - 1]._id : null;
    
    return NextResponse.json({ 
      success: true, 
      data,
      pagination: {
        nextCursor,
        hasMore
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const event = await Event.create(body);
    
    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
