import React from 'react';
import webimg from '../img/webimg.jpg';

interface HeroProps {
  onShopNowClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onShopNowClick }) => {
  return (
    <div 
      className="relative bg-cover bg-center h-96" 
      style={{ backgroundImage: `url(${webimg})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center text-white p-4">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Premium Tech, Unbeatable Prices.
          </h2>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
            Discover the latest in cutting-edge electronics and accessories, delivered right to your door.
          </p>
          <button
            onClick={onShopNowClick}
            className="mt-8 px-8 py-3 bg-indigo-600 border border-transparent rounded-md font-semibold text-white hover:bg-indigo-700 transition duration-300"
          >
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
