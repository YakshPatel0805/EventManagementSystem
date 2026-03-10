import connectDB from '@/lib/mongoose';
import Booking from '@/models/Booking';

async function migrateBookingSchema() {
  try {
    await connectDB();
    
    console.log('Starting booking schema migration...');
    
    // Drop the existing collection to recreate with new schema
    try {
      await Booking.collection.drop();
      console.log('Dropped existing Booking collection');
    } catch (error) {
      console.log('Booking collection does not exist or already dropped');
    }
    
    // Recreate the collection with the new schema
    await Booking.collection.createIndex({ eventId: 1, status: 1 });
    await Booking.collection.createIndex({ userEmail: 1 });
    await Booking.collection.createIndex({ createdAt: -1 });
    await Booking.collection.createIndex({ userEmail: 1, status: 1 });
    
    console.log('✓ Booking schema migration completed successfully');
    console.log('✓ New enum values for paymentStatus: pending, completed, failed, refund-pending, refunded');
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateBookingSchema();
