import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Event from '@/models/Event';

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find({}).sort({ date: 1 });
    return NextResponse.json({ success: true, data: events });
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
