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
    id: 6,
    title: 'Workshop: Line Follower Robot',
    description: 'This workshop introduces the basics of electronics and programming for line follower robots. Learn about key components, clean coding practices, and get hands-on experience.',
    date: 'October 7, 2026',
    time: '14:00 PM',
    location: 'Youth Center of Sfax',
    category: 'Workshop',
    image: '/images/news-6.webp',
    attendees: 0,
    status: 'upcoming',
    registeredCount: 0,
    maxAttendees: 100,
  },
  {
    id: 7,
    title: 'Info Session',
    description: 'Join us for an introductory session about IEEE RAS ENIS! We will discuss our club rules, upcoming activities, and give a warm welcome to all new members.',
    date: 'September 24, 2026',
    time: '12:00 -- 13:00 PM',
    location: 'ENIS Amphi 4',
    category: 'Social',
    image: '/images/news-7.webp',
    attendees: 0,
    status: 'past',
    registeredCount: 0,
    maxAttendees: 150,
  },
  {
    id: 2,
    title: 'Smart Distance Alert \nBootcamp',
    description:
      'Give your child the opportunity to discover the exciting world of robotics through an interactive, hands-on workshop designed especially for young innovators!',
    date: 'June 27/28/29, 2026',
    time: '17:00 PM - 19:30 PM',
    location: 'Youth Center of Sfax',
    category: 'Workshop',
    image: '/images/stem/img0.webp',
    attendees: 50,
    status: 'past',
    registeredCount: 42,
    maxAttendees: 50,
    photos: [
      '/images/stem/img0.webp',
      '/images/stem/img1.webp',
    ]
  },
  {
    id: 3,
    title: 'Line Follower internal competition',
    description: 'Internal competition for line follower robots for the new members.',
    date: 'October 12, 2025',
    time: '14:00 PM',
    location: 'Youth Center of Sfax',
    category: 'Competition',
    image: '/images/gallery/workshop/comp.webp',
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
    image: '/images/gallery/workshop/0.webp',
    attendees: 92,
    status: 'past',
    registeredCount: 92,
    maxAttendees: 92,
    photos: [
      '/images/gallery/workshop/0.webp',
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
