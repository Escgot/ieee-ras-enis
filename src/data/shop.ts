export interface ShopItem {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
}

export const shopItems: ShopItem[] = [
  {
    id: 1,
    name: 'RAS ENIS Official Hoodie',
    description: 'Premium heavyweight cotton hoodie with high-quality embroidery.',
    price: '45.00 TND',
    category: 'Merch',
    image: '/images/shop/hoodie.jpg',
  },
  {
    id: 2,
    name: 'Robot Operating System Guide',
    description: 'Comprehensive guide to getting started with ROS2 and robotics.',
    price: '15.00 TND',
    category: 'Books',
    image: '/images/shop/book.jpg',
  },
  {
    id: 3,
    name: 'Arduino Development Kit',
    description: 'Complete set of sensors and actuators for your next project.',
    price: '120.00 TND',
    category: 'Electronics',
    image: '/images/shop/arduino.jpg',
  },
  {
    id: 4,
    name: '3D Printing Service',
    description: 'Custom 3D printing for your robotic parts (price per gram).',
    price: 'From 5.00 TND',
    category: 'Service',
    image: '/images/shop/3dprint.jpg',
  },
];
