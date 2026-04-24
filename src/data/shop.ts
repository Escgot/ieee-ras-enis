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
    price: '2.00 TND',
    category: 'key chain',
    image: '/images/shop/Keyring-Mockup.webp',
  },
  {
    id: 3,
    name: 'Arduino Development Kit',
    description: 'Complete set of sensors and actuators for your next project.',
    price: '55.00 TND',
    category: 'Electronics',
    image: '/images/shop/robot.jpg',
  },
  {
    id: 4,
    name: 'RAS Polo',
    description: 'RAS Polo',
    price: '35.00 TND',
    category: 'Merch',
    image: '/images/shop/polo.webp',
  },
  {
    id: 5,
    name: 'RAS Cap',
    description: 'RAS Cap',
    price: '25.00 TND',
    category: 'Merch',
    image: '/images/shop/ras-cap.webp',
  },
  {
    id: 6,
    name: 'RAS notebook',
    description: 'RAS notebook',
    price: '15.00 TND',
    category: 'Merch',
    image: '/images/shop/ras-notebook.webp',
  },
  {
    id: 7,
    name: 'RAS stickers',
    description: 'RAS stickers',
    price: '1.00 TND',
    category: 'Merch',
    image: '/images/shop/ras-stickers.webp',
  },
  {
    id: 8,
    name: 'RAS water bottle',
    description: 'RAS water bottle',
    price: '20.00 TND',
    category: 'Merch',
    image: '/images/shop/ras-water-bottle.webp',
  },
  {
    id: 9,
    name: 'RAS Mug',
    description: 'RAS Mug',
    price: '5.00 TND',
    category: 'Merch',
    image: '/images/shop/ras-mug.webp',
  },
  {
    id: 10,
    name: 'RAS keychain',
    description: 'RAS keychain',
    price: '2.00 TND',
    category: 'keychain',
    image: '/images/shop/key-ring.webp',
  },
  {
    id: 11,
    name: 'RAS t-shirt black',
    description: 'RAS t-shirt black',
    price: '35.00 TND',
    category: 'Merch',
    image: '/images/shop/ras-t-shirt-black.webp',
  },
  {
    id: 12,
    name: 'RAS t-shirt white',
    description: 'RAS t-shirt white',
    price: '35.00 TND',
    category: 'Merch',
    image: '/images/shop/ras-t-shirt-white.webp',
  },
];
