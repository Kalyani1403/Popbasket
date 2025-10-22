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
      <div className="text-center py-20 max-w-md mx-auto px-4">
        <h2 className="text-2xl font-semibold text-gray-700">Your wishlist is empty</h2>
        <p className="text-gray-500 mt-2">Add items you love to your wishlist to keep track of them.</p>
        <button
          onClick={() => onNavigate('home')}
          className="mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
        >
          Discover Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
         <h1 className="text-3xl font-bold text-gray-900">Your Wishlist</h1>
      </div>
      <div className="bg-white shadow-md rounded-lg">
        <ul className="divide-y divide-gray-200">
          {wishlistItems.map(item => (
            <li key={item.id} className="p-4 flex items-center space-x-4">
              <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-md object-cover" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-500 text-sm">₹{item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-3">
                 <button 
                   onClick={() => handleMoveToCart(item)}
                   className="flex items-center px-3 py-2 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-md hover:bg-indigo-200"
                 >
                    <ShoppingCartIcon className="w-5 h-5 mr-2" />
                    Move to Cart
                 </button>
                 <button 
                   onClick={() => removeFromWishlist(item.id)} 
                   className="text-gray-400 hover:text-red-500 p-2"
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
