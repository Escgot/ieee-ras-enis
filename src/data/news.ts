export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
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
    image: '/images/news-featured.webp',
    isFeatured: true,
    photos: [
      '/images/gallery/iit6.webp',
      '/images/gallery/iit0.webp',
      '/images/gallery/iit1.webp',
      '/images/gallery/iit2.webp',
      '/images/gallery/iit3.webp',
      '/images/gallery/iit4.webp',

    ]
  },
  {
    id: 2,
    title: 'Spring Build Challenge Registration Now Open',
    excerpt: 'Join our annual build challenge and showcase your engineering skills.',
    date: 'Feb 10, 2025',
    category: 'Events',
    readTime: '3 min read',
    image: '/images/news-1.webp',
  },
  {
    id: 3,
    title: 'Workshop Recap: Intro to ROS2 with 40+ Attendees',
    excerpt: 'Great turnout for our latest workshop on the Robot Operating System.',
    date: 'Jan 28, 2025',
    category: 'Workshop',
    readTime: '2 min read',
    image: '/images/news-2.webp',
  },
  {
    id: 4,
    title: 'New Sponsor: TechDrive Components Joins AXIOM',
    excerpt: 'We are excited to welcome TechDrive as our newest technical partner.',
    date: 'Jan 15, 2025',
    category: 'Sponsors',
    readTime: '1 min read',
    image: '/images/news-3.webp',
  },
  {
    id: 5,
    title: 'HEX-ARM 6DOF Completes First Full Demo Run',
    excerpt: 'Significant milestone reached in our latest industrial robotic arm project.',
    date: 'Jan 4, 2025',
    category: 'Project Update',
    readTime: '2 min read',
    image: '/images/news-4.webp',
  },
];
