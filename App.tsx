import React, { useState } from 'react';
import { Product } from './types';
import { INITIAL_PRODUCTS } from './constants';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { OrderProvider } from './contexts/OrderContext';
import { ReviewProvider } from './contexts/ReviewContext';
import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import CartView from './components/CartView';
import CheckoutView from './components/CheckoutView';
import AdminView from './components/AdminView';
import WishlistView from './components/WishlistView';
import LoginView from './components/LoginView';
import SignupView from './components/SignupView';
import OrderHistoryView from './components/OrderHistoryView';


type View = 'home' | 'product' | 'cart' | 'checkout' | 'admin' | 'orderSuccess' | 'wishlist' | 'login' | 'signup' | 'orderHistory';

const AppContent: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [pendingProductId, setPendingProductId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const { currentUser } = useAuth();

  const handleNavigate = (newView: View) => {
    // Protect routes that require a logged-in user
    const isUserRoute = ['cart', 'wishlist', 'checkout', 'orderSuccess', 'orderHistory'].includes(newView);
    if (isUserRoute && !currentUser) {
      setView('login');
      return;
    }

    // Protect admin route
    if (newView === 'admin') {
      if (!currentUser) {
        setView('login');
        return;
      }
      if (currentUser.role !== 'admin') {
        setView('home'); // or show an 'unauthorized' message
        return;
      }
    }
    
    setView(newView);
    if(newView === 'home' || newView === 'login' || newView === 'signup') {
        setSelectedProductId(null);
    }
  };
  
  const handleViewDetails = (productId: number) => {
    // If user is not logged in, remember the requested product and send to login
    if (!currentUser) {
      setPendingProductId(productId);
      setView('login');
      return;
    }

    setSelectedProductId(productId);
    setView('product');
  };

  const handleAddProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };
  
  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };
  
  const handleDeleteProduct = (productId: number) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };
  
  const selectedProduct = products.find(p => p.id === selectedProductId);

  const renderView = () => {
    switch (view) {
      case 'login':
        return (
          <LoginView
            onLoginSuccess={() => {
              if (pendingProductId) {
                setSelectedProductId(pendingProductId);
                setPendingProductId(null);
                setView('product');
              } else {
                setView('home');
              }
            }}
            onSwitchToSignup={() => setView('signup')}
          />
        );
      case 'signup':
        return (
          <SignupView
            onSignupSuccess={() => {
              if (pendingProductId) {
                setSelectedProductId(pendingProductId);
                setPendingProductId(null);
                setView('product');
              } else {
                setView('home');
              }
            }}
            onSwitchToLogin={() => setView('login')}
          />
        );
      case 'product':
        return selectedProduct ? <ProductDetail product={selectedProduct} onBack={() => setView('home')} /> : <ProductList products={products} onViewDetails={handleViewDetails} />;
      case 'cart':
        return <CartView onNavigate={(v) => handleNavigate(v as View)} />;
      case 'checkout':
        return <CheckoutView onOrderPlaced={() => setView('orderSuccess')} />;
      case 'admin':
        return <AdminView products={products} onAddProduct={handleAddProduct} onUpdateProduct={handleUpdateProduct} onDeleteProduct={handleDeleteProduct} />;
      case 'wishlist':
        return <WishlistView onNavigate={(v) => handleNavigate(v)} />;
      case 'orderHistory':
        return <OrderHistoryView onViewProductReview={handleViewDetails} />;
      case 'orderSuccess':
        return (
          <div className="text-center py-20 max-w-md mx-auto px-4">
            <h2 className="text-2xl font-semibold text-green-600">Order Placed Successfully!</h2>
            <p className="text-gray-500 mt-2">Thank you for your purchase. You will receive a confirmation email shortly.</p>
            <button
              onClick={() => setView('home')}
              className="mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
            >
              Back to Home
            </button>
          </div>
        );
      case 'home':
      default:
        return <ProductList products={products} onViewDetails={handleViewDetails} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onNavigate={handleNavigate} />
      <main className="flex-grow">
        {renderView()}
      </main>
      <footer className="bg-gray-800 text-white py-4 text-center text-sm">
  <p>&copy; {new Date().getFullYear()} PopBasket. All rights reserved.</p>
      </footer>
    </div>
  );
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <OrderProvider>
            <ReviewProvider>
              <AppContent />
            </ReviewProvider>
          </OrderProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
};


export default App;
