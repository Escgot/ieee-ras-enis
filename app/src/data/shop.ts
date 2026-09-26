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
    name: 'RAS t-shirt black',
    description: 'RAS t-shirt black',
    price: '35.00 TND',
    category: 'Merch',
    image: '/images/shop/ras-t-shirt-black.webp',
  },
  {
    id: 2,
    name: 'RAS stickers',
    description: 'RAS stickers',
    price: '1.00 TND',
    category: 'Merch',
    image: '/images/shop/ras-stickers.webp',
  },
  {
    id: 3,
    name: 'RAS PORTECLE',
    description: 'Sleek and durable metal keychain featuring the IEEE ENIS Robotics & Automation Society design. With its polished finish and modern look, it’s the perfect accessory to showcase your passion for innovation and robotics while keeping your keys organized in style.',
    price: '2.00 TND',
    category: 'key chain',
    image: '/images/shop/Keyring-Mockup.webp',
  },
  {
    id: 4,
    name: 'Arduino Development Kit',
    description: 'Complete set of sensors and actuators for your next project.',
    price: '55.00 TND',
    category: 'Electronics',
    image: '/images/shop/robot.jpg',
  },
  {
    id: 5,
    name: 'RAS Polo',
    description: 'RAS Polo',
    price: '35.00 TND',
    category: 'Merch',
    image: '/images/shop/polo.webp',
  },
  {
    id: 6,
    name: 'RAS Cap',
    description: 'RAS Cap',
    price: '25.00 TND',
    category: 'Merch',
    image: '/images/shop/ras-cap.webp',
  },
  {
    id: 7,
    name: 'RAS t-shirt white',
    description: 'RAS t-shirt white',
    price: '35.00 TND',
    category: 'Merch',
    image: '/images/shop/ras-t-shirt-white.webp',
  },
  {
    id: 8,
    name: 'RAS keychain',
    description: 'RAS keychain',
    price: '2.00 TND',
    category: 'key chain',
    image: '/images/shop/key-ring.webp',
  },
];
