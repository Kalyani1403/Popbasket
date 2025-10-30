import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Order, CartItem } from '../types';
import { useAuth } from './AuthContext';

interface OrderContextType {
  ordersForCurrentUser: Order[];
  addOrder: (items: CartItem[], totalAmount: number) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Record<number, Order[]>>(() => {
    try {
      const localData = window.localStorage.getItem('orders');
      return localData ? JSON.parse(localData) : {};
    } catch (error) {
      console.error("Could not parse orders from localStorage", error);
      return {};
    }
  });

  const { currentUser } = useAuth();

  useEffect(() => {
    window.localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (items: CartItem[], totalAmount: number) => {
    if (!currentUser) return;

    const newOrder: Order = {
      id: `ORD-${Date.now()}-${currentUser.id}`,
      userId: currentUser.id,
      date: new Date().toISOString(),
      items,
      totalAmount,
      status: 'Processing',
    };

    setOrders(prevOrders => {
      const userOrders = prevOrders[currentUser.id] || [];
      return {
        ...prevOrders,
        [currentUser.id]: [...userOrders, newOrder],
      };
    });
  };
  
  const ordersForCurrentUser = (currentUser && orders[currentUser.id]) ? orders[currentUser.id].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : [];


  return (
    <OrderContext.Provider value={{ ordersForCurrentUser, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};