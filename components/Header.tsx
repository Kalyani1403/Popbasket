import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCartIcon, UserCircleIcon, HeartIcon, LoginIcon, LogoutIcon, ClipboardListIcon } from './icons';

type View = 'home' | 'cart' | 'admin' | 'wishlist' | 'login' | 'signup' | 'orderHistory' | 'profile';

interface HeaderProps {
  onNavigate: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const { itemCount } = useCart();
  const { wishlistItemCount } = useWishlist();
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-gradient-to-r from-indigo-500 to-purple-600 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          <div className="flex-shrink-0">
            <h1 
              className="text-2xl font-bold text-white cursor-pointer tracking-tight hover:text-yellow-300 transition-colors"
              onClick={() => onNavigate('home')}
            >
              PopBasket
            </h1>
          </div>

          {/* User Navigation */}
          <nav className="flex items-center space-x-3 md:space-x-4">
            {currentUser ? (
              <>
                <button onClick={() => onNavigate('profile')} 
                  className="hidden md:flex items-center gap-2 text-white group transition-all duration-200">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20 group-hover:ring-yellow-300/50 transition-all" />
                  ) : (
                    <UserCircleIcon className="w-8 h-8 text-white/90 group-hover:text-yellow-300 transition-colors" />
                  )}
                  <span className="group-hover:text-yellow-300">Hi, {currentUser.name}</span>
                </button>
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className="text-white hover:text-yellow-300 transition-colors"
                    aria-label="Admin Panel"
                  >
                    <UserCircleIcon className="w-7 h-7" />
                  </button>
                )}
                <button
                  onClick={() => onNavigate('orderHistory')}
                  className="relative text-white hover:text-yellow-300 transition-colors"
                  aria-label="Order History"
                >
                  <ClipboardListIcon className="w-7 h-7" />
                </button>
                <button
                  onClick={() => onNavigate('wishlist')}
                  className="relative text-white hover:text-yellow-300 transition-colors"
                  aria-label="Wishlist"
                >
                  <HeartIcon className="w-7 h-7" />
                  {wishlistItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                      {wishlistItemCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => onNavigate('cart')}
                  className="relative text-white hover:text-yellow-300 transition-colors"
                  aria-label="Shopping Cart"
                >
                  <ShoppingCartIcon className="w-7 h-7" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                      {itemCount}
                    </span>
                  )}
                </button>
                 <button
                    onClick={logout}
                    className="text-white hover:text-yellow-300 transition-colors flex items-center"
                    aria-label="Sign out"
                  >
                    <LogoutIcon className="w-7 h-7" />
                  </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('login')}
                  className="px-4 py-2 text-sm font-medium text-white hover:text-yellow-300 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="px-4 py-2 text-sm font-medium text-white bg-white/10 rounded-full hover:bg-white/20 transition-all duration-200"
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