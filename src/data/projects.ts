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
    technologies: ['ESP32', 'C++', 'custom electronic board', 'IR sensors', 'DC motors'],
    photos: [
      '/images/projects/news-featured.webp',
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
    technologies: ['Real-time control', 'STMCube', 'PID', 'UART', 'Kinematics'],
  },
  {
    id: 3,
    title: 'FIGHTER ROBOT',
    description: 'This project presents a compact fighter robot engineered for competitive robotics challenges. Built on a robust custom chassis, the robot combines powerful motors, precise control systems, and responsive sensors to detect opponents and react instantly. Its design emphasizes speed, stability, and strategic maneuverability, enabling it to push, evade, and outmatch rivals within the arena. Optimized for performance and durability, the robot delivers fast, aggressive, and controlled combat behavior in every match',
    category: 'FIGHTER',
    number: '03',
    image: '/images/projects/fighter.webp',
    status: 'completed',
    technologies: ['Weapon systems', 'Armor systems', 'Chassis design', 'Kinetic energy weapons'],
  },
  {
    id: 4,
    title: 'AUTONOME',
    description: 'Bipedal robot with pneumatic balancing and dynamic walking capabilities.',
    category: 'AUTONOME',
    number: '04',
    image: '/images/projects/autonome.webp',
    status: 'in-progress',
    technologies: ['Raspberry Pi', 'ROS2', 'LiDAR', 'RF modules', 'PWM control'],
  },
];
