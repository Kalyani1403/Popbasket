import React, { useState, useMemo, useRef } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import Hero from './Hero';

interface ProductListProps {
  products: Product[];
  onViewDetails: (productId: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onViewDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('default');
  const productGridRef = useRef<HTMLDivElement>(null);

  const handleShopNowClick = () => {
    productGridRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const categories = useMemo(() => ['All', ...new Set(products.map(p => p.category))], [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Create a mutable copy before sorting
    result = [...result];

    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // No sort needed for 'default', maintains original order
        break;
    }

    return result;
  }, [products, searchTerm, selectedCategory, sortOption]);

  return (
    <>
  <Hero onShopNowClick={handleShopNowClick} />
      <div ref={productGridRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-100">
        <div className="mb-8 md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Our Products
            </h2>
          </div>
          <div className="mt-4 flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3 md:mt-0 md:ml-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-72 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow"
                aria-label="Search products"
              />
              <svg className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select
              id="sort-options"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full md:w-auto px-4 py-2.5 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition-shadow"
              aria-label="Sort products"
            >
              <option value="default">Sort by Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A-Z</option>
              <option value="name-desc">Name: Z-A</option>
            </select>
          </div>
        </div>

        <div className="mb-8">
          <label className="text-sm font-medium text-gray-900 sr-only" id="category-filter-label">Filter by category</label>
          <div role="group" aria-labelledby="category-filter-label" className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-200 hover:text-indigo-500 hover:shadow-md'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map(product => (
              <ProductCard key={product.id} product={product} onViewDetails={onViewDetails} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-700">No products found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filter.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductList;
