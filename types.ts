export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string; // In a real app, this would be hashed
  role: 'admin' | 'user';
}

export interface Order {
  id: string;
  userId: number;
  date: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
}

export interface Review {
  id: string;
  productId: number;
  userId: number;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}
