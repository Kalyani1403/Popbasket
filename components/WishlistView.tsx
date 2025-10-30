import React from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { TrashIcon, ShoppingCartIcon } from './icons';
import { Product } from '../types';

interface WishlistViewProps {
  onNavigate: (view: 'home') => void;
}

const WishlistView: React.FC<WishlistViewProps> = ({ onNavigate }) => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product: Product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-20 max-w-md mx-auto px-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg">
        <div className="relative">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Your Wishlist is Empty
          </h2>
          <p className="text-gray-600 mt-4">Add items you love to your wishlist to keep track of them.</p>
          <div className="mt-8 inline-block bg-gradient-to-r from-indigo-600 to-purple-600 p-[2px] rounded-full">
            <button
              onClick={() => onNavigate('home')}
              className="px-6 py-2 bg-white rounded-full hover:bg-transparent hover:text-white transition-colors duration-300"
            >
              Discover Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Your Wishlist
        </h1>
        <span className="text-sm font-medium text-gray-500">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
        <ul className="divide-y divide-gray-100">
          {wishlistItems.map(item => (
            <li key={item.id} className="group p-6 flex items-center space-x-6 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-colors duration-300">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-300"></div>
                <img src={item.imageUrl} alt={item.name} className="relative w-24 h-24 rounded-xl object-cover border-2 border-gray-100" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
                <p className="text-gray-500 mt-1">₹{item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-4">
                 <button 
                   onClick={() => handleMoveToCart(item)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                 >
                    <ShoppingCartIcon className="w-5 h-5 mr-2" />
                    Move to Cart
                 </button>
                 <button 
                   onClick={() => removeFromWishlist(item.id)} 
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-300"
                   aria-label="Remove from wishlist"
                 >
                   <TrashIcon className="w-5 h-5" />
                 </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WishlistView;
