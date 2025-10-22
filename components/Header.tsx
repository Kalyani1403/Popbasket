import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCartIcon, UserCircleIcon, HeartIcon, LoginIcon, LogoutIcon, ClipboardListIcon } from './icons';

type View = 'home' | 'cart' | 'admin' | 'wishlist' | 'login' | 'signup' | 'orderHistory';

interface HeaderProps {
  onNavigate: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const { itemCount } = useCart();
  const { wishlistItemCount } = useWishlist();
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 
              className="text-2xl font-bold text-indigo-600 cursor-pointer"
              onClick={() => onNavigate('home')}
            >
              PopBasket
            </h1>
          </div>
          <nav className="flex items-center space-x-4 md:space-x-6">
            {currentUser ? (
              <>
                <span className="text-sm text-gray-600 hidden md:block">Hi, {currentUser.name}</span>
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className="text-gray-500 hover:text-indigo-600 transition-colors"
                    aria-label="Admin Panel"
                  >
                    <UserCircleIcon className="w-7 h-7" />
                  </button>
                )}
                <button
                  onClick={() => onNavigate('orderHistory')}
                  className="relative text-gray-500 hover:text-indigo-600 transition-colors"
                  aria-label="Order History"
                >
                  <ClipboardListIcon className="w-7 h-7" />
                </button>
                <button
                  onClick={() => onNavigate('wishlist')}
                  className="relative text-gray-500 hover:text-red-500 transition-colors"
                  aria-label="Wishlist"
                >
                  <HeartIcon className="w-7 h-7" />
                  {wishlistItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistItemCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => onNavigate('cart')}
                  className="relative text-gray-500 hover:text-indigo-600 transition-colors"
                  aria-label="Shopping Cart"
                >
                  <ShoppingCartIcon className="w-7 h-7" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>
                 <button
                    onClick={logout}
                    className="text-gray-500 hover:text-indigo-600 transition-colors flex items-center"
                    aria-label="Sign out"
                  >
                    <LogoutIcon className="w-7 h-7" />
                  </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('login')}
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="ml-4 px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Sign Up
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;