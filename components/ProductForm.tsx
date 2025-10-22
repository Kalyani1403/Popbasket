
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { generateDescription } from '../services/geminiService';
import { SparklesIcon } from './icons';

interface ProductFormProps {
  product?: Product | null;
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    imageUrl: '',
  });
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        category: product.category,
        description: product.description,
        imageUrl: product.imageUrl,
      });
    } else {
      setFormData({ name: '', price: '', category: '', description: '', imageUrl: '' });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateDescription = async () => {
    if (!formData.name || !keywords) {
      alert('Please provide a product name and some keywords to generate a description.');
      return;
    }
    setIsGenerating(true);
    const description = await generateDescription(formData.name, keywords);
    setFormData(prev => ({ ...prev, description }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: product?.id || Date.now(),
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      description: formData.description,
      imageUrl: formData.imageUrl || `https://picsum.photos/seed/${formData.name}/400/400`,
    };
    onSave(newProduct);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800">{product ? 'Edit Product' : 'Add New Product'}</h2>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
          <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required step="0.01" />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required />
        </div>
      </div>
      
      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL (Optional)</label>
        <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" placeholder="Leave blank for random image" />
      </div>
      
      <div>
        <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">Description Keywords</label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input type="text" name="keywords" id="keywords" value={keywords} onChange={e => setKeywords(e.target.value)} className="flex-1 block w-full border-gray-300 rounded-none rounded-l-md py-2 px-3" placeholder="e.g. fast, sleek, user-friendly" />
          <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="inline-flex items-center px-3 py-2 border border-l-0 border-indigo-600 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 disabled:bg-gray-400">
            <SparklesIcon className="h-5 w-5 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" required></textarea>
      </div>

      <div className="flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Save Product</button>
      </div>
    </form>
  );
};

export default ProductForm;
