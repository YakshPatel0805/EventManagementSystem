import mongoose from 'mongoose';
import Event from '../models/Event';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/EventManagementSystem';

const seedEvents = [
  {
    title: "Tech Innovation Summit 2026",
    description: "Join industry leaders and innovators for a full day of cutting-edge technology discussions, networking opportunities, and hands-on workshops. Explore the latest trends in AI, blockchain, and cloud computing.",
    image: "/images/tech.png",
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
    image: "/images/ai.png",
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
    image: "/images/web.png",
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
    image: "/images/startup.png",
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
    image: "/images/cloud.png",
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
    image: "/images/cyber.png",
    slug: "cybersecurity-summit",
    time: "9:00 AM - 4:00 PM",
    venue: "Chicago Security Center",
    date: new Date("2026-08-12"),
    capacity: 250,
    bookedSeats: 0,
    price: 2499
  },
  {
    title: "Blockchain Future Forum",
    description: "Discover how blockchain is transforming finance, healthcare, and supply chains with expert talks and interactive panel discussions.",
    image: "/images/blockchain.png",
    slug: "blockchain-future-forum",
    time: "11:00 AM - 6:00 PM",
    venue: "Dubai World Trade Centre",
    date: new Date("2026-05-05"),
    capacity: 300,
    bookedSeats: 0,
    price: 2799
  },
  {
    title: "Startup & Entrepreneurship Meetup",
    description: "An inspiring meetup for startup founders and entrepreneurs focusing on funding, growth strategies, and innovation.",
    image: "/images/startup-meetup.png",
    slug: "startup-entrepreneurship-meetup",
    time: "2:00 PM - 7:00 PM",
    venue: "Berlin Startup Campus",
    date: new Date("2026-08-18"),
    capacity: 250,
    bookedSeats: 0,
    price: 1999
  },
  {
    title: "Data Science & Analytics Summit",
    description: "Deep dive into data science, big data analytics, and visualization techniques with hands-on sessions and case studies.",
    image: "/images/data-science.png",
    slug: "data-science-analytics-summit",
    time: "9:00 AM - 5:00 PM",
    venue: "Toronto Convention Centre",
    date: new Date("2026-09-14"),
    capacity: 500,
    bookedSeats: 0,
    price: 2899
  },
  {
    title: "AR/VR Experience Expo",
    description: "Explore the future of augmented and virtual reality with immersive demos, product showcases, and expert talks.",
    image: "/images/ar-vr.png",
    slug: "ar-vr-experience-expo",
    time: "11:00 AM - 6:00 PM",
    venue: "Tokyo Big Sight",
    date: new Date("2026-10-09"),
    capacity: 300,
    bookedSeats: 0,
    price: 3499
  },
  {
    title: "Green Tech & Sustainability Forum",
    description: "A conference dedicated to sustainable technology solutions and environmental innovation for a greener future.",
    image: "/images/green.png",
    slug: "green-tech-sustainability-forum",
    time: "10:00 AM - 5:00 PM",
    venue: "Sydney Convention Centre",
    date: new Date("2026-11-22"),
    capacity: 400,
    bookedSeats: 0,
    price: 2599
  },
  {
    title: "Full Stack Developer Conference",
    description: "A must-attend event for full stack developers covering frontend, backend, DevOps, and modern frameworks.",
    image: "/images/full-stack.png",
    slug: "full-stack-developer-conference",
    time: "9:00 AM - 6:00 PM",
    venue: "Mumbai Exhibition Centre",
    date: new Date("2026-12-05"),
    capacity: 600,
    bookedSeats: 0,
    price: 2999
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
