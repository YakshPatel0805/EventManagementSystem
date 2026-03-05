import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Event from '@/models/Event';

export async function GET(
  request: NextRequest,
<<<<<<< HEAD
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const event = await Event.findById(id);
=======
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const event = await Event.findById(params.id);
>>>>>>> f2c311adb61bb038bcbbc830b850bcf64d60cb0d
    
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
<<<<<<< HEAD
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const event = await Event.findByIdAndUpdate(id, body, { new: true });
=======
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    const event = await Event.findByIdAndUpdate(params.id, body, { new: true });
>>>>>>> f2c311adb61bb038bcbbc830b850bcf64d60cb0d
    
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
<<<<<<< HEAD
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const event = await Event.findByIdAndDelete(id);
=======
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const event = await Event.findByIdAndDelete(params.id);
>>>>>>> f2c311adb61bb038bcbbc830b850bcf64d60cb0d
    
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
