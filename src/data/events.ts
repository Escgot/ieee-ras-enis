export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
  attendees: number;
  status: 'upcoming' | 'past';
  registeredCount?: number;
  maxAttendees?: number;
  photos?: string[];
}

export const events: Event[] = [
  {
    id: 1,
    title: 'Robotics Hackathon 2024',
    description:
      '48-hour intensive hackathon focused on building innovative robotics solutions. Prizes worth $5000!',
    date: 'March 15, 2024',
    time: '9:00 AM',
    location: 'Engineering Building, Room 301',
    category: 'Hackathon',
    image: '/images/event-hackathon.webp',
    attendees: 120,
    status: 'upcoming',
    registeredCount: 67,
    maxAttendees: 100,
    photos: [
      '/images/event-hackathon.webp',
      '/images/event-workshop.webp',
      '/images/event-competition.webp',
      '/images/news-1.webp'
    ]
  },
  {
    id: 2,
    title: 'Workshop: AI in Robotics',
    description:
      'Learn how to integrate AI and machine learning into your robotics projects. Hands-on session with real robots.',
    date: 'March 22, 2024',
    time: '2:00 PM',
    location: 'Innovation Lab',
    category: 'Workshop',
    image: '/images/event-workshop.webp',
    attendees: 45,
    status: 'upcoming',
    registeredCount: 42,
    maxAttendees: 50,
  },
  {
    id: 3,
    title: 'Robot Wars Competition',
    description:
      'Battle of the bots! Bring your custom-built robots to compete in various categories.',
    date: 'April 5, 2024',
    time: '10:00 AM',
    location: 'Main Auditorium',
    category: 'Competition',
    image: '/images/event-competition.webp',
    attendees: 200,
    status: 'upcoming',
    registeredCount: 89,
    maxAttendees: 200,
  },
  {
    id: 4,
    title: 'Industry Networking Night',
    description:
      'Connect with industry professionals and explore career opportunities in robotics and automation.',
    date: 'April 12, 2024',
    time: '6:00 PM',
    location: 'Conference Room A',
    category: 'Social',
    image: '/images/event-hackathon.webp',
    attendees: 80,
    status: 'upcoming',
    registeredCount: 30,
    maxAttendees: 100,
  },
  {
    id: 5,
    title: 'Arduino Basics Workshop',
    description: 'Introduction to Arduino programming for beginners. No prior experience required.',
    date: 'February 10, 2024',
    time: '10:00 AM',
    location: 'Lab 101',
    category: 'Workshop',
    image: '/images/event-workshop.webp',
    attendees: 60,
    status: 'past',
    registeredCount: 60,
    maxAttendees: 60,
  },
  {
    id: 6,
    title: 'Line Follower Challenge',
    description: 'Design and build autonomous robots that can follow a line path.',
    date: 'January 28, 2024',
    time: '9:00 AM',
    location: 'Main Auditorium',
    category: 'Competition',
    image: '/images/event-competition.webp',
    attendees: 90,
    status: 'past',
    registeredCount: 90,
    maxAttendees: 100,
  },
  {
    id: 7,
    title: 'ARDUINO WORKSHOP',
    description:
      'This workshop introduced the basics of electronics and programming for line follower robots. Participants learned about key components, clean coding practices, and function management, while gaining hands-on experience using pre-prepared robots to understand how line followers work effectively.',
    date: '07-october-2023',
    time: '14:00 PM',
    location: 'ENIS Robotics Lab',
    category: 'Workshop',
    image: '/images/event-workshop.webp',
    attendees: 40,
    status: 'past',
    registeredCount: 40,
    maxAttendees: 50,
  },
];
