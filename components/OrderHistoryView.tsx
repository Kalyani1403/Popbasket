import React, { useState } from 'react';
import { useOrder } from '../contexts/OrderContext';

interface OrderHistoryViewProps {
  onViewProductReview: (productId: number) => void;
}

const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({ onViewProductReview }) => {
  const { ordersForCurrentUser } = useOrder();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
  };
  
  const getStatusColor = (status: 'Processing' | 'Shipped' | 'Delivered') => {
    switch (status) {
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
    }
  };

  if (ordersForCurrentUser.length === 0) {
    return (
      <div className="text-center py-20 max-w-md mx-auto px-4">
        <h2 className="text-2xl font-semibold text-gray-700">No Order History</h2>
        <p className="text-gray-500 mt-2">You haven't placed any orders yet. Let's change that!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Orders</h1>
      <div className="space-y-4">
        {ordersForCurrentUser.map(order => (
          <div key={order.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div 
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
              onClick={() => toggleOrderDetails(order.id)}
              role="button"
              aria-expanded={expandedOrderId === order.id}
              aria-controls={`order-details-${order.id}`}
            >
              <div>
                <p className="font-semibold text-indigo-600">Order #{order.id.split('-')[1]}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                 <p className="font-bold text-lg text-gray-800">₹{order.totalAmount.toFixed(2)}</p>
                 <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                   {order.status}
                 </span>
              </div>
            </div>
            {expandedOrderId === order.id && (
              <div id={`order-details-${order.id}`} className="p-4 border-t border-gray-200 bg-gray-50">
                <h4 className="font-semibold mb-2 text-gray-700">Items:</h4>
                <ul className="space-y-2">
                  {order.items.map(item => (
                    <li key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center">
                        <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-md object-cover mr-3" />
                        <div>
                          <p className="text-gray-800">{item.name}</p>
                          <p className="text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600">₹{(item.price * item.quantity).toFixed(2)}</p>
                        <button 
                          onClick={() => onViewProductReview(item.id)}
                          className="text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline mt-1 focus:outline-none"
                        >
                          Review Product
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryView;
