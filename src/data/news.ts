export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
  isFeatured?: boolean;
}

export const news: NewsItem[] = [
  {
    id: 1,
    title: 'AXIOM TAKES 1ST PLACE AT REGIONAL ROBOTICS LEAGUE',
    excerpt: 'Our Delta Drone V2 team swept the autonomous navigation category, outpacing 14 other university teams in a timed obstacle course challenge...',
    date: 'Feb 18, 2025',
    category: 'Competitions',
    readTime: '5 min read',
    image: '/images/news-featured.jpg',
    isFeatured: true,
  },
  {
    id: 2,
    title: 'Spring Build Challenge Registration Now Open',
    excerpt: 'Join our annual build challenge and showcase your engineering skills.',
    date: 'Feb 10, 2025',
    category: 'Events',
    readTime: '3 min read',
    image: '/images/news-1.jpg',
  },
  {
    id: 3,
    title: 'Workshop Recap: Intro to ROS2 with 40+ Attendees',
    excerpt: 'Great turnout for our latest workshop on the Robot Operating System.',
    date: 'Jan 28, 2025',
    category: 'Workshop',
    readTime: '2 min read',
    image: '/images/news-2.jpg',
  },
  {
    id: 4,
    title: 'New Sponsor: TechDrive Components Joins AXIOM',
    excerpt: 'We are excited to welcome TechDrive as our newest technical partner.',
    date: 'Jan 15, 2025',
    category: 'Sponsors',
    readTime: '1 min read',
    image: '/images/news-3.jpg',
  },
  {
    id: 5,
    title: 'HEX-ARM 6DOF Completes First Full Demo Run',
    excerpt: 'Significant milestone reached in our latest industrial robotic arm project.',
    date: 'Jan 4, 2025',
    category: 'Project Update',
    readTime: '2 min read',
    image: '/images/news-4.jpg',
  },
];
