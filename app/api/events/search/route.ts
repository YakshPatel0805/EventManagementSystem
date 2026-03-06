import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Event from '@/models/Event';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Search in title and description using regex
    const searchRegex = new RegExp(query, 'i'); // Case-insensitive search

    const events = await Event.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { venue: searchRegex }
      ]
    })
      .sort({ date: 1 })
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Search failed:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}
