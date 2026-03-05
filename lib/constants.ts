export interface Event {
  title: string;
  image: string;
  slug: string;
  time: string;
  location: string;
  date: string;
}

export const events: Event[] = [
  {
    title: "Tech Innovation Summit 2026",
    image: "/images/event1.png",
    slug: "tech-innovation-summit-2026",
    time: "9:00 AM - 5:00 PM",
    location: "San Francisco Convention Center",
    date: "March 15, 2026"
  },
  {
    title: "AI & Machine Learning Conference",
    image: "/images/event2.png",
    slug: "ai-machine-learning-conference",
    time: "10:00 AM - 6:00 PM",
    location: "Seattle Tech Hub",
    date: "April 22, 2026"
  },
  {
    title: "Web Development Bootcamp",
    image: "/images/event3.png",
    slug: "web-development-bootcamp",
    time: "8:00 AM - 4:00 PM",
    location: "Austin Innovation Center",
    date: "May 10, 2026"
  },
  {
    title: "Startup Pitch Night",
    image: "/images/event4.png",
    slug: "startup-pitch-night",
    time: "6:00 PM - 9:00 PM",
    location: "New York Startup Hub",
    date: "June 5, 2026"
  },
  {
    title: "Cloud Computing Workshop",
    image: "/images/event5.png",
    slug: "cloud-computing-workshop",
    time: "1:00 PM - 5:00 PM",
    location: "Boston Tech Campus",
    date: "July 18, 2026"
  }
];
