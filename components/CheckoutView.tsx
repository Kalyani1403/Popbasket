import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useOrder } from '../contexts/OrderContext';
import { useAuth } from '../contexts/AuthContext';


interface CheckoutViewProps {
  onOrderPlaced: () => void;
}

const CheckoutView: React.FC<CheckoutViewProps> = ({ onOrderPlaced }) => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { addOrder } = useOrder();
  const { currentUser } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const tax = cartTotal * 0.08;
  const total = cartTotal + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      // Should not happen if route is protected, but as a safeguard.
      alert("You must be logged in to place an order.");
      return;
    }

    setIsProcessing(true);
    addOrder(cartItems, total);

    // Simulate payment processing
    setTimeout(() => {
      clearCart();
      onOrderPlaced();
    }, 2000);
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Shipping Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" id="name" defaultValue={currentUser?.name || ''} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" id="address" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" defaultValue={currentUser?.email || ''} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>
              <button
                type="submit"
                disabled={isProcessing || cartItems.length === 0}
                className="w-full mt-6 py-3 px-6 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
              >
                {isProcessing ? 'Processing...' : `Place Order - ₹${total.toFixed(2)}`}
              </button>
            </div>
          </form>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Order Summary</h2>
          <div className="space-y-3">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{item.name} x {item.quantity}</span>
                <span className="font-medium text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-800">₹{cartTotal.toFixed(2)}</span>
            </div>
             <div className="flex justify-between text-sm">
              <span className="text-gray-600">Taxes</span>
              <span className="font-medium text-gray-800">₹{tax.toFixed(2)}</span>
            </div>
             <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;