
import React from 'react';
import { useCart } from '../contexts/CartContext';
import { TrashIcon, PlusIcon, MinusIcon, ArrowLeftIcon } from './icons';

interface CartViewProps {
  onNavigate: (view: 'home' | 'checkout') => void;
}

const CartView: React.FC<CartViewProps> = ({ onNavigate }) => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20 max-w-md mx-auto px-4">
        <h2 className="text-2xl font-semibold text-gray-700">Your cart is empty</h2>
        <p className="text-gray-500 mt-2">Looks like you haven't added anything to your cart yet.</p>
        <button
          onClick={() => onNavigate('home')}
          className="mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  const tax = cartTotal * 0.08;
  const total = cartTotal + tax;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
         <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
         <button onClick={() => onNavigate('home')} className="flex items-center text-indigo-600 hover:text-indigo-800">
             <ArrowLeftIcon className="w-5 h-5 mr-2" />
             Continue Shopping
         </button>
      </div>
      <div className="bg-white shadow-md rounded-lg">
        <ul className="divide-y divide-gray-200">
          {cartItems.map(item => (
            <li key={item.id} className="p-4 flex items-center space-x-4">
              <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-md object-cover" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-500 text-sm">₹{item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center border border-gray-300 rounded-md">
                 <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-l-md">
                  <MinusIcon className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm">{item.quantity}</span>
                 <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-r-md">
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
              <p className="font-semibold w-20 text-right">₹{(item.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                <TrashIcon className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end space-x-10">
            <div className="text-right">
              <p className="text-gray-600">Subtotal</p>
              <p className="text-gray-600">Taxes (8%)</p>
              <p className="text-lg font-bold text-gray-800">Total</p>
            </div>
            <div className="text-right">
              <p className="text-gray-800">₹{cartTotal.toFixed(2)}</p>
              <p className="text-gray-800">₹{tax.toFixed(2)}</p>
              <p className="text-lg font-bold text-gray-900">₹{total.toFixed(2)}</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('checkout')}
            className="w-full mt-6 py-3 px-6 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartView;
