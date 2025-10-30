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

export interface Address {
  id: number;
  label?: string; // e.g., Home, Work
  fullName?: string;
  phone?: string;
  street: string;
  city: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string; // In a real app, this would be hashed
  role: 'admin' | 'user';
  phone?: string;
  addresses?: Address[];
  avatar?: string; // data URL or image path
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
