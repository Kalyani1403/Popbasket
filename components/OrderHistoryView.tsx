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
      <div className="text-center py-20 max-w-md mx-auto px-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">No Order History</h2>
        <p className="text-gray-600 mt-4">You haven't placed any orders yet. Let's change that!</p>
        <div className="mt-6 inline-block bg-gradient-to-r from-indigo-600 to-purple-600 p-[2px] rounded-full">
          <button onClick={() => window.location.href = '/'} className="px-6 py-2 bg-white rounded-full hover:bg-transparent hover:text-white transition-colors duration-300">
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">My Orders</h1>
        <div className="text-sm font-medium text-gray-500">
          {ordersForCurrentUser.length} {ordersForCurrentUser.length === 1 ? 'Order' : 'Orders'}
        </div>
      </div>
      <div className="space-y-4">
        {ordersForCurrentUser.map(order => (
          <div key={order.id} className="bg-white shadow-lg rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border border-gray-100">
            <div 
              className="p-6 flex items-center justify-between cursor-pointer bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-colors duration-300"
              onClick={() => toggleOrderDetails(order.id)}
              role="button"
              aria-expanded={expandedOrderId === order.id}
              aria-controls={`order-details-${order.id}`}
            >
              <div>
                <p className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Order #{order.id.split('-')[1]}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(order.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                 <p className="font-bold text-xl text-gray-800">₹{order.totalAmount.toFixed(2)}</p>
                 <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                   {order.status}
                 </span>
              </div>
            </div>
            {expandedOrderId === order.id && (
              <div id={`order-details-${order.id}`} className="p-6 border-t border-gray-100 bg-gradient-to-br from-gray-50 to-white">
                <h4 className="font-semibold mb-4 text-gray-700 text-lg">Order Items</h4>
                <ul className="space-y-2">
                  {order.items.map(item => (
                    <li key={item.id} className="flex justify-between items-center p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-center">
                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-xl object-cover mr-4 border-2 border-gray-100" />
                        <div>
                          <p className="text-gray-800 font-medium">{item.name}</p>
                          <p className="text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-800 font-semibold mb-2">₹{(item.price * item.quantity).toFixed(2)}</p>
                        <button 
                          onClick={() => onViewProductReview(item.id)}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
