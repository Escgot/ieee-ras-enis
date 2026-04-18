export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
  location: string;
  isFeatured?: boolean;
  photos?: string[];
}

export const news: NewsItem[] = [
  {
    id: 1,
    title: 'SANGOUR TAKES 1ST PLACE AT LINE FOLLOWER CHALLENGE AT IIT ROBOTICS',
    excerpt: 'The Line Follower Challenge at IIT Robots brought together some of the sharpest university teams in a high-speed test of precision, control, and algorithmic efficiency. After an intense showdown on the track, it was Sangour who claimed the top spot, outperforming the competition with exceptional stability and speed.',
    date: 'April 11, 2026',
    category: 'Competitions',
    readTime: '3 min read',
    image: '/images/gallery/iit/iit0.webp',
    location: 'IIT Sfax',
    isFeatured: true,
    photos: [
      '/images/gallery/iit/iit0.webp',
      '/images/gallery/iit/iit1.webp',
      '/images/gallery/iit/iit2.webp',
      '/images/gallery/iit/iit3.webp',
      '/images/gallery/iit/iit4.webp',
      '/images/gallery/iit/iit5.webp',
    ]
  },
  {
    id: 2,
    title: 'HUNTER TAKES 1ST PLACE AT LINE FOLLOWER CHALLENGE AT ROBOSTATION 1.0',
    excerpt: 'Join our annual build challenge and showcase your engineering skills.',
    date: 'Mar 28, 2026',
    category: 'Competitions',
    readTime: '3 min read',
    image: '/images/gallery/epi1.webp',
    location: 'EPI Sousse',
    photos: [
      '/images/gallery/epi1.webp',
      '/images/gallery/epi2.webp',
    ]
  },
  {
    id: 3,
    title: 'HUNTER AND VIPER DESTROYING THE FSM ROBOTS',
    excerpt: 'The FSM Robots competition was a thrilling event that tested the skills of the best robotics teams in the country. Our team, Sangour, emerged victorious, showcasing the power of our innovative robot design.',
    date: 'Feb 15, 2026',
    category: 'Competitions',
    readTime: '5 min read',
    image: '/images/gallery/fsm/fsm1.webp',
    location: 'FSM Monastir',
    photos: [
      '/images/gallery/fsm/fsm1.webp',
      '/images/gallery/fsm/fsm2.webp',
      '/images/gallery/fsm/fsm3.webp',
      '/images/gallery/fsm/fsm4.webp',
    ]
  },
  {
    id: 4,
    title: 'SANGOUR TAKES 1ST PLACE AT LINE FOLLOWER CHALLENGE AT ENETROBOTS',
    excerpt: 'We are excited to welcome TechDrive as our newest technical partner.',
    date: 'Feb 08, 2026',
    category: 'Competitions',
    readTime: '4 min read',
    image: '/images/gallery/enet/enet0.webp',
    location: "ENET'Com Sfax",
    photos: [
      '/images/gallery/enet/enet0.webp',
      '/images/gallery/enet/enet1.webp',
      '/images/gallery/enet/enet2.webp',
      '/images/gallery/enet/enet3.webp',
      '/images/gallery/enet/enet4.webp',
      '/images/gallery/enet/enet5.webp',
      '/images/gallery/enet/enet6.webp',
      '/images/gallery/enet/enet7.webp',
      '/images/gallery/enet/enet8.webp',
      '/images/gallery/enet/enet9.webp',
      '/images/gallery/enet/enet10.webp',
      '/images/gallery/enet/enet11.webp',
      '/images/gallery/enet/enet12.webp',
      '/images/gallery/enet/enet13.webp',
      '/images/gallery/enet/enet14.webp',
      '/images/gallery/enet/enet15.webp',
    ]
  },
  {
    id: 5,
    title: 'HUNTER TAKES 1ST PLACE AT LINE FOLLOWER CHALLENGE AT ENSIT BOTPATH',
    excerpt: 'The ENSIT Botpath competition was a thrilling event that tested the skills of the best robotics teams in the country. Our team, Sangour, emerged victorious, showcasing the power of our innovative robot design.',
    date: 'Jan 4, 2025',
    category: 'Competitions',
    readTime: '2 min read',
    image: '/images/gallery/ensit/ensit0.webp',
    location: 'ENSIT Tunis',
    photos: [
      '/images/gallery/ensit/ensit0.webp',
      '/images/gallery/ensit/ensit1.webp',
      '/images/gallery/ensit/ensit2.webp',
    ]
  },
];
