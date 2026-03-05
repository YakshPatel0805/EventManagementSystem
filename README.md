# Event Management System

A full-stack event management system built with Next.js 16 and MongoDB that allows users to browse and book events.

## Features

- 📅 View all events with title, date, time, venue, and description
- 🎫 Book events with real-time seat availability
- 💾 MongoDB database integration with Mongoose
- 🔄 Real-time seat tracking
- 📱 Responsive design
- ⚡ Server-side rendering with Next.js

## Tech Stack

- Next.js 16
- TypeScript
- MongoDB with Mongoose
- Tailwind CSS
- React 19

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure MongoDB

Make sure your `.env` file has the MongoDB connection string:

```
MONGODB_URI=mongodb://localhost:27017/EventManagementSystem
```

### 3. Seed the Database

Populate the database with sample events:

```bash
npm run seed
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── events/          # Event CRUD API routes
│   │   └── bookings/        # Booking API routes
│   ├── events/[id]/         # Event detail page
│   └── page.tsx             # Dashboard (home page)
├── components/
│   ├── EventCard.tsx        # Event card component
│   ├── BookingForm.tsx      # Booking form component
│   └── ...
├── models/
│   ├── Event.ts             # Event Mongoose model
│   └── Booking.ts           # Booking Mongoose model
├── lib/
│   └── mongoose.ts          # MongoDB connection utility
└── scripts/
    └── seed.ts              # Database seeding script
```

## API Endpoints

### Events

- `GET /api/events` - Get all events
- `POST /api/events` - Create a new event
- `GET /api/events/[id]` - Get event by ID
- `PUT /api/events/[id]` - Update event
- `DELETE /api/events/[id]` - Delete event

### Bookings

- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create a new booking

## Database Models

### Event Model

```typescript
{
  title: string;
  description: string;
  image: string;
  slug: string;
  time: string;
  venue: string;
  date: Date;
  capacity: number;
  bookedSeats: number;
}
```

### Booking Model

```typescript
{
  eventId: ObjectId;
  userName: string;
  userEmail: string;
  numberOfSeats: number;
  bookingDate: Date;
  status: 'confirmed' | 'cancelled';
}
```

## Usage

1. Browse events on the dashboard
2. Click on an event to view details
3. Fill out the booking form with your name, email, and number of seats
4. Submit to confirm your booking
5. Seat availability updates in real-time

## Notes

- Make sure MongoDB is running before starting the application
- The seed script will clear existing events and create fresh sample data
- Bookings are tracked and seats are automatically updated
