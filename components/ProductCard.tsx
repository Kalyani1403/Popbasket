import React from 'react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { HeartIcon } from './icons';
import { useReviews } from '../contexts/ReviewContext';
import StarRating from './StarRating';

interface ProductCardProps {
  product: Product;
  onViewDetails: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { getReviewsForProduct } = useReviews();

  const isWishlisted = isInWishlist(product.id);
  
  const reviews = getReviewsForProduct(product.id);
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event from firing
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 relative">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover cursor-pointer"
        onClick={() => onViewDetails(product.id)}
      />
      <button
        onClick={handleWishlistToggle}
        className={`absolute top-3 right-3 p-1.5 rounded-full transition-colors duration-200 ${
          isWishlisted ? 'bg-red-100 text-red-500' : 'bg-white/70 text-gray-600 hover:text-red-500'
        }`}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <HeartIcon className="w-6 h-6" solid={isWishlisted} />
      </button>
      <div className="p-4 flex flex-col h-52 justify-between">
        <div>
          <h3
            className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-indigo-600"
            onClick={() => onViewDetails(product.id)}
          >
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{product.category}</p>
          <div className="mt-2 flex items-center">
            {reviews.length > 0 ? (
              <>
                <StarRating rating={averageRating} readOnly={true} size="sm" />
                <span className="text-xs text-gray-500 ml-2">({reviews.length})</span>
              </>
            ) : (
              <span className="text-xs text-gray-400">No reviews yet</span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
          <button
            onClick={() => addToCart(product, 1)}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
