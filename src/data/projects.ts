export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  number: string;
  image: string;
  status: 'completed' | 'in-progress';
  technologies: string[];
}

export const projects: Project[] = [
  {
    id: 1,
    title: 'DELTA DRONE V2',
    description: 'LiDAR-equipped quadcopter with onboard path planning using ROS2 and custom navigation stack. Obstacle avoidance at 12m/s.',
    category: 'AUTONOMOUS',
    number: '01',
    image: '/images/projects/drone.jpg',
    status: 'completed',
    technologies: ['ROS2', 'C++', 'Python', 'LiDAR'],
  },
  {
    id: 2,
    title: 'HEX-ARM 6DOF',
    description: '6-axis robotic arm with sub-millimeter precision, running on custom inverse kinematics solver. Designed for PCB assembly demos.',
    category: 'INDUSTRIAL ARM',
    number: '02',
    image: '/images/projects/arm.jpg',
    status: 'completed',
    technologies: ['Inverse Kinematics', 'STMCube', 'Python'],
  },
  {
    id: 3,
    title: 'VISIONSORT ML',
    description: 'Real-time conveyor sorting system using YOLOv8 and custom pneumatic actuators. Achieves 98.2% classification accuracy.',
    category: 'COMPUTER VISION',
    number: '03',
    image: '/images/projects/ml.jpg',
    status: 'completed',
    technologies: ['PyTorch', 'OpenCV', 'YOLOv8'],
  },
  {
    id: 4,
    title: 'AERO-BIPED',
    description: 'Bipedal robot with pneumatic balancing and dynamic walking capabilities.',
    category: 'HUMANOID',
    number: '04',
    image: '/images/projects/biped.jpg',
    status: 'in-progress',
    technologies: ['Control Systems', 'Pneumatics'],
  },
];
