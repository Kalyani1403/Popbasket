import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useReviews } from '../contexts/ReviewContext';
import { useAuth } from '../contexts/AuthContext';
import { useOrder } from '../contexts/OrderContext';
import StarRating from './StarRating';
import { ArrowLeftIcon, PlusIcon, MinusIcon, HeartIcon } from './icons';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addReview, getReviewsForProduct } = useReviews();
  const { currentUser } = useAuth();
  const { ordersForCurrentUser } = useOrder();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  
  const isWishlisted = isInWishlist(product.id);

  const reviews = getReviewsForProduct(product.id);
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  const hasPurchased = ordersForCurrentUser.some(order => order.items.some(item => item.id === product.id));
  const hasReviewed = reviews.some(review => review.userId === currentUser?.id);
  const canReview = currentUser && hasPurchased && !hasReviewed;

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewRating === 0) {
      setReviewError('Please select a star rating.');
      return;
    }
    if (reviewComment.trim() === '') {
      setReviewError('Please write a comment.');
      return;
    }
    addReview(product.id, reviewRating, reviewComment);
    setReviewRating(0);
    setReviewComment('');
    setReviewError('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={onBack} className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Back to Products
      </button>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden md:flex">
        <div className="md:w-1/2">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <span className="text-sm text-gray-500 font-semibold uppercase">{product.category}</span>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
            <div className="mt-3 flex items-center">
              <StarRating rating={averageRating} readOnly={true} />
              <a href="#reviews" className="ml-3 text-sm text-gray-500 hover:text-indigo-600">
                {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </a>
            </div>
            <p className="text-gray-600 mt-4">{product.description}</p>
          </div>
          <div className="mt-6">
            <div className="text-4xl font-extrabold text-gray-900 mb-6">₹{product.price.toFixed(2)}</div>
            <div className="flex items-center mb-4">
              <label htmlFor="quantity" className="mr-4 font-medium text-gray-700">Quantity:</label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 text-gray-500 hover:bg-gray-100 rounded-l-md">
                  <MinusIcon className="w-5 h-5" />
                </button>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                  className="w-12 text-center border-l border-r border-gray-300 focus:outline-none"
                  min="1"
                />
                <button onClick={() => setQuantity(q => q + 1)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-r-md">
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex items-stretch space-x-3">
              <button
                onClick={handleAddToCart}
                className={`flex-grow py-3 px-6 text-white font-semibold rounded-md transition-colors duration-300 ${
                  added ? 'bg-green-500' : 'bg-indigo-600 hover:bg-indigo-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {added ? 'Added to Cart!' : 'Add to Cart'}
              </button>
              <button
                onClick={handleWishlistToggle}
                className={`p-3 border rounded-md transition-colors flex items-center justify-center ${
                  isWishlisted 
                    ? 'border-red-500 bg-red-100 text-red-500' 
                    : 'border-gray-300 text-gray-500 hover:border-red-500 hover:text-red-500'
                }`}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <HeartIcon className="w-6 h-6" solid={isWishlisted} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div id="reviews" className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>

        {canReview ? (
          <div className="mt-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <form onSubmit={handleReviewSubmit}>
              <h3 className="text-lg font-medium text-gray-900">Write a review</h3>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Your Rating</label>
                <StarRating rating={reviewRating} onRatingChange={setReviewRating} />
              </div>
              <div className="mt-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Your Review</label>
                <textarea
                  id="comment"
                  name="comment"
                  rows={4}
                  className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                ></textarea>
              </div>
              {reviewError && <p className="text-sm text-red-500 mt-2">{reviewError}</p>}
              <div className="mt-4 text-right">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="mt-6 p-4 bg-blue-50 text-blue-700 rounded-lg text-sm">
            {!currentUser && <p>Please sign in to leave a review.</p>}
            {currentUser && !hasPurchased && <p>You must purchase this product to leave a review.</p>}
            {currentUser && hasPurchased && hasReviewed && <p>You have already reviewed this product. Thank you for your feedback!</p>}
          </div>
        )}

        <div className="mt-8 space-y-8">
          {reviews.length > 0 ? (
            reviews.map(review => (
              <div key={review.id} className="border-t border-gray-200 pt-8">
                <div className="flex items-center">
                  <StarRating rating={review.rating} readOnly={true} size="sm" />
                  <p className="ml-4 font-bold text-gray-800">{review.userName}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">{new Date(review.date).toLocaleDateString()}</p>
                <p className="mt-3 text-base text-gray-600">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 mt-6">This product has no reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
