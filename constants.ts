import { Product, User } from './types';

import quantumImg from './img/quantum-core-laptop.webp';
import acousticImg from './img/acoustic-bliss-headphones.jpg';
import smartHubImg from './img/smart-home-hub.jpg';
import alchemistImg from './img/the-alchemists-secret.jpg';
import coffeeTableImg from './img/modernist-coffee-table.jpg';
import chairImg from './img/ergo-comfort-office-chair.webp';
import gourmetCoffeeImg from './img/gourmet-coffee-beans.jpg';
import greenTeaImg from './img/organic-green-tea.webp';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Quantum Core Laptop',
    price: 1299.99,
    description: 'Experience blazing-fast performance with the new Quantum Core processor. Perfect for gaming, content creation, and everyday tasks. Features a stunning 15.6" 4K display.',
    category: 'Electronics',
    imageUrl: quantumImg,
  },
  {
    id: 2,
    name: 'Acoustic Bliss Headphones',
    price: 199.99,
    description: 'Immerse yourself in pure sound with these noise-cancelling over-ear headphones. Crystal-clear highs and deep, rich bass. 30-hour battery life.',
    category: 'Electronics',
    imageUrl: acousticImg,
  },
  {
    id: 3,
    name: 'Smart Home Hub',
    price: 89.99,
    description: 'The central command for your smart home. Control lights, thermostats, and more with your voice. Compatible with all major smart device brands.',
    category: 'Electronics',
    imageUrl: smartHubImg,
  },
  {
    id: 4,
    name: 'The Alchemist\'s Secret',
    price: 14.99,
    description: 'A thrilling mystery novel that will keep you on the edge of your seat. Follow the protagonist as they unravel a centuries-old conspiracy.',
    category: 'Books',
    imageUrl: alchemistImg,
  },
  {
    id: 5,
    name: 'Modernist Coffee Table',
    price: 349.00,
    description: 'A sleek and stylish addition to any living room. Made from sustainably sourced oak with a minimalist design.',
    category: 'Home Goods',
    imageUrl: coffeeTableImg,
  },
  {
    id: 6,
    name: 'Ergo-Comfort Office Chair',
    price: 275.50,
    description: 'Support your back and improve your posture with this ergonomic office chair. Fully adjustable to fit your body perfectly.',
    category: 'Home Goods',
    imageUrl: chairImg,
  },
  {
    id: 7,
    name: 'Gourmet Coffee Beans',
    price: 22.95,
    description: 'A 12oz bag of single-origin, medium-roast Arabica coffee beans from the highlands of Colombia. Notes of chocolate and citrus.',
    category: 'Groceries',
    imageUrl: gourmetCoffeeImg,
  },
  {
    id: 8,
    name: 'Organic Green Tea',
    price: 15.00,
    description: 'A box of 50 premium organic Sencha green tea bags. A delicate and refreshing taste, packed with antioxidants.',
    category: 'Groceries',
    imageUrl: greenTeaImg,
  },
];

export const INITIAL_USERS: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@popbasket.com', password: 'adminpassword', role: 'admin' },
  { id: 2, name: 'Test User', email: 'user@popbasket.com', password: 'userpassword', role: 'user' },
];