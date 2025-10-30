
import React, { useState } from 'react';
import { Product } from '../types';
import ProductForm from './ProductForm';

interface AdminViewProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ products, onAddProduct, onUpdateProduct, onDeleteProduct }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormVisible(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingProduct(null);
  };

  const handleSave = (product: Product) => {
    if (editingProduct) {
      onUpdateProduct(product);
    } else {
      onAddProduct(product);
    }
    setIsFormVisible(false);
    setEditingProduct(null);
  };

  const handleDeleteRequest = (product: Product) => {
    setProductToDelete(product);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      onDeleteProduct(productToDelete.id);
      setProductToDelete(null); // Close the modal
    }
  };

  const cancelDelete = () => {
    setProductToDelete(null); // Close the modal
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        {!isFormVisible && (
          <button
            onClick={handleAddNew}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Add New Product
          </button>
        )}
      </div>

      {isFormVisible ? (
        <ProductForm product={editingProduct} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {products.map(product => (
              <li key={product.id}>
                <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                  <div className="flex items-center min-w-0">
                    <img className="h-12 w-12 rounded-md object-cover flex-shrink-0" src={product.imageUrl} alt={product.name} />
                    <div className="ml-4 min-w-0">
                      <p className="text-md font-medium text-indigo-600 truncate">{product.name}</p>
                      <p className="text-sm text-gray-500">₹{product.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="space-x-3 flex-shrink-0 ml-4">
                    <button onClick={() => handleEdit(product)} className="text-sm font-medium text-indigo-600 hover:text-indigo-900">Edit</button>
                    <button onClick={() => handleDeleteRequest(product)} className="text-sm font-medium text-red-600 hover:text-red-900">Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Deletion Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" aria-modal="true" role="dialog">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900">Confirm Deletion</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete the product "{productToDelete.name}"? This action cannot be undone.
              </p>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
