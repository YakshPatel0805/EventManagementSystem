import mongoose from 'mongoose';
import Event from '../models/Event';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/EventManagementSystem';

const seedEvents = [
  {
    title: "Tech Innovation Summit 2026",
    description: "Join industry leaders and innovators for a full day of cutting-edge technology discussions, networking opportunities, and hands-on workshops. Explore the latest trends in AI, blockchain, and cloud computing.",
    image: "/images/event1.png",
    slug: "tech-innovation-summit-2026",
    time: "9:00 AM - 5:00 PM",
    venue: "San Francisco Convention Center",
    date: new Date("2026-03-15"),
    capacity: 500,
    bookedSeats: 0,
    price: 2999
  },
  {
    title: "AI & Machine Learning Conference",
    description: "Dive deep into artificial intelligence and machine learning with expert speakers from leading tech companies. Learn about neural networks, deep learning, and practical AI applications.",
    image: "/images/event2.png",
    slug: "ai-machine-learning-conference",
    time: "10:00 AM - 6:00 PM",
    venue: "Seattle Tech Hub",
    date: new Date("2026-04-22"),
    capacity: 300,
    bookedSeats: 0,
    price: 3499
  },
  {
    title: "Web Development Bootcamp",
    description: "Intensive full-day bootcamp covering modern web development practices. Learn React, Next.js, TypeScript, and best practices for building scalable web applications.",
    image: "/images/event3.png",
    slug: "web-development-bootcamp",
    time: "8:00 AM - 4:00 PM",
    venue: "Austin Innovation Center",
    date: new Date("2026-05-10"),
    capacity: 150,
    bookedSeats: 0,
    price: 1999
  },
  {
    title: "Startup Pitch Night",
    description: "Watch innovative startups pitch their ideas to investors and industry experts. Network with entrepreneurs, investors, and fellow innovators in an exciting evening event.",
    image: "/images/event4.png",
    slug: "startup-pitch-night",
    time: "6:00 PM - 9:00 PM",
    venue: "New York Startup Hub",
    date: new Date("2026-06-05"),
    capacity: 200,
    bookedSeats: 0,
    price: 499
  },
  {
    title: "Cloud Computing Workshop",
    description: "Hands-on workshop covering AWS, Azure, and Google Cloud Platform. Learn about cloud architecture, deployment strategies, and cost optimization techniques.",
    image: "/images/event5.png",
    slug: "cloud-computing-workshop",
    time: "1:00 PM - 5:00 PM",
    venue: "Boston Tech Campus",
    date: new Date("2026-07-18"),
    capacity: 100,
    bookedSeats: 0,
    price: 1499
  },
  {
    title: "Cybersecurity Summit",
    description: "Stay ahead of cyber threats with insights from security experts. Learn about the latest security protocols, ethical hacking, and how to protect your applications.",
    image: "/images/event6.png",
    slug: "cybersecurity-summit",
    time: "9:00 AM - 4:00 PM",
    venue: "Chicago Security Center",
    date: new Date("2026-08-12"),
    capacity: 250,
    bookedSeats: 0,
    price: 2499
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Event.deleteMany({});
    console.log('Cleared existing events');

    await Event.insertMany(seedEvents);
    console.log('Seeded events successfully');

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
