import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Review } from '../types';
import { useAuth } from './AuthContext';

interface ReviewContextType {
  addReview: (productId: number, rating: number, comment: string) => void;
  getReviewsForProduct: (productId: number) => Review[];
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const localData = window.localStorage.getItem('reviews');
      return localData ? JSON.parse(localData) : [];
    } catch (error)
      {
      console.error("Could not parse reviews from localStorage", error);
      return [];
    }
  });

  const { currentUser } = useAuth();

  useEffect(() => {
    window.localStorage.setItem('reviews', JSON.stringify(reviews));
  }, [reviews]);

  const addReview = (productId: number, rating: number, comment: string) => {
    if (!currentUser) return;

    const newReview: Review = {
      id: `REV-${Date.now()}-${currentUser.id}`,
      productId,
      userId: currentUser.id,
      userName: currentUser.name,
      rating,
      comment,
      date: new Date().toISOString(),
    };

    setReviews(prevReviews => [...prevReviews, newReview]);
  };

  const getReviewsForProduct = (productId: number): Review[] => {
    return reviews
      .filter(review => review.productId === productId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return (
    <ReviewContext.Provider value={{ addReview, getReviewsForProduct }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = (): ReviewContextType => {
  const context = useContext(ReviewContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
};
