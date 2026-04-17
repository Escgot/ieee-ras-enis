export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  number: string;
  image: string;
  status: 'completed' | 'in-progress';
  technologies: string[];
  photos?: string[];
}

export const projects: Project[] = [
  {
    id: 1,
    title: 'LINE FOLLOWER ROBOT',
    description: 'This project showcases a compact robot designed to follow a predefined path using line-tracking technology. Built on a custom electronic board, the robot integrates multiple sensors that detect contrast between the surface and the guiding line, allowing it to navigate curves and intersections with precision.',
    category: 'LINE FOLLOWER',
    number: '01',
    image: '/images/projects/news-featured.webp',
    status: 'completed',
    technologies: ['ROS2', 'C++', 'Python', 'LiDAR'],
    photos: [
      '/images/projects/news-featured.webp',
      '/images/projects/tt-terrain.webp',
      '/images/projects/ml.webp'
    ]
  },
  {
    id: 2,
    title: 'ALL TERRAIN ROBOT',
    description: 'This project features a robust all-terrain robotic vehicle engineered for mobility across challenging surfaces. Designed with four high-traction rugged wheels, the robot ensures stability and control on uneven terrain, making it suitable for both indoor testing environments and outdoor exploration.',
    category: 'ALL TERRAIN',
    number: '02',
    image: '/images/projects/tt-terrain.webp',
    status: 'completed',
    technologies: ['Inverse Kinematics', 'STMCube', 'Python'],
  },
  {
    id: 3,
    title: 'VISIONSORT ML',
    description: 'Real-time conveyor sorting system using YOLOv8 and custom pneumatic actuators. Achieves 98.2% classification accuracy.',
    category: 'COMPUTER VISION',
    number: '03',
    image: '/images/projects/ml.webp',
    status: 'completed',
    technologies: ['PyTorch', 'OpenCV', 'YOLOv8'],
  },
  {
    id: 4,
    title: 'AERO-BIPED',
    description: 'Bipedal robot with pneumatic balancing and dynamic walking capabilities.',
    category: 'HUMANOID',
    number: '04',
    image: '/images/projects/biped.webp',
    status: 'in-progress',
    technologies: ['Control Systems', 'Pneumatics'],
  },
];
