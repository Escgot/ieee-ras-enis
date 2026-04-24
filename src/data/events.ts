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
    title: 'Workshop: Robot Automation',
    description:
      'This workshop introduced the basics of electronics and programming for line follower robots. Participants learned about key components, clean coding practices, and function management, while gaining hands-on experience using pre-prepared robots to understand how line followers work effectively.',
    date: 'April 26, 2026',
    time: '14:00 PM',
    location: 'Youth Center of Sfax',
    category: 'Workshop',
    image: '/images/news-1.webp',
    attendees: 50,
    status: 'upcoming',
    registeredCount: 42,
    maxAttendees: 50,
    photos: [
      '/images/news-1.webp'
    ]
  },
  {
    id: 2,
    title: 'Workshop: AI in Robotics',
    description:
      'Learn how to integrate AI and machine learning into your robotics projects. Hands-on session with real robots.',
    date: 'April 19, 2026',
    time: '14:00 PM',
    location: 'Youth Center of Sfax',
    category: 'Workshop',
    image: '/images/news-3.jpg',
    attendees: 45,
    status: 'upcoming',
    registeredCount: 42,
    maxAttendees: 50,
  },
  {
    id: 3,
    title: 'Line Follower internal competition',
    description: 'Internal competition for line follower robots for the new members.',
    date: 'October 12, 2025',
    time: '14:00 PM',
    location: 'Youth Center of Sfax',
    category: 'Competition',
    image: '/images/gallery/workshop/comp.jpg',
    attendees: 90,
    status: 'past',
    registeredCount: 90,
    maxAttendees: 92,
  },
  
  {
    id: 4,
    title: 'ARDUINO WORKSHOP',
    description:
      'This workshop introduced the basics of electronics and programming for line follower robots. Participants learned about key components, clean coding practices, and function management, while gaining hands-on experience using pre-prepared robots to understand how line followers work effectively.',
    date: 'September 29, 2025',
    time: '14:00 PM',
    location: 'Youth Center of Sfax',
    category: 'Workshop',
    image: '/images/gallery/workshop/0.jpg',
    attendees: 92,
    status: 'past',
    registeredCount: 92,
    maxAttendees: 92,
    photos: [
      '/images/gallery/workshop/0.jpg',
    ]
  },
  {
    id: 5,
    title: 'Arduino Basics Workshop',
    description: 'Introduction to Arduino programming for beginners. No prior experience required.',
    date: 'September 28, 2025',
    time: '14:00 PM',
    location: 'Youth Center of Sfax',
    category: 'Workshop',
    image: '/images/gallery/workshop/0.webp',
    attendees: 92,
    status: 'past',
    registeredCount: 92,
    maxAttendees: 92,
    photos: [
      '/images/gallery/workshop/0.webp',
      '/images/gallery/workshop/1.webp',
      '/images/gallery/workshop/2.webp',
      '/images/gallery/workshop/3.webp',
    ]
  },
];
