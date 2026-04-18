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
    image: '/images/shop/hoodie.webp',
  },
  {
    id: 2,
    name: 'RAS PORTECLE',
    description: 'Sleek and durable metal keychain featuring the IEEE ENIS Robotics & Automation Society design. With its polished finish and modern look, it’s the perfect accessory to showcase your passion for innovation and robotics while keeping your keys organized in style.',
    price: '3.00 TND',
    category: 'key chain',
    image: '/images/shop/Keyring-Mockup.webp',
  },
  {
    id: 3,
    name: 'Arduino Development Kit',
    description: 'Complete set of sensors and actuators for your next project.',
    price: '60.00 TND',
    category: 'Electronics',
    image: '/images/shop/kit-arduino.webp',
  },
  {
    id: 4,
    name: '3D Printing Service',
    description: 'Custom 3D printing for your robotic parts (price per gram).',
    price: 'From 5.00 TND',
    category: 'Service',
    image: '/images/shop/3dprint.webp',
  },
];
