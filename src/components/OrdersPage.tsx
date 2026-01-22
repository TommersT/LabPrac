import { ArrowLeft, Package, Calendar, MapPin } from 'lucide-react';
import { Order } from '../types';

interface OrdersPageProps {
  orders: Order[];
  onBack: () => void;
}

export default function OrdersPage({ orders, onBack }: OrdersPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 font-semibold mb-8 hover:text-blue-700 transition-colors"
      >
        <ArrowLeft size={20} /> Back to Shop
      </button>

      <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <Package className="text-blue-600" size={32} />
        My Orders
      </h2>

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-md text-center">
          <Package className="mx-auto text-gray-300 mb-4" size={64} />
          <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 p-4 border-b flex flex-wrap justify-between items-center gap-4">
                <div className="flex gap-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Order Placed</p>
                    <div className="flex items-center gap-1 text-gray-700">
                      <Calendar size={14} />
                      <span className="text-sm">{order.date}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total</p>
                    <p className="text-sm font-bold text-blue-600">₱{order.total.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Ship To</p>
                    <p className="text-sm text-gray-700">{order.shippingInfo.name}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 font-mono">ID: {order.id}</p>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      Items
                    </h4>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                          <div>
                            <p className="text-sm font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity} × ₱{item.price.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <MapPin size={16} className="text-blue-600" />
                      Delivery Details
                    </h4>
                    <p className="text-sm text-gray-700 mb-1 font-medium">{order.shippingInfo.phone}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{order.shippingInfo.address}</p>
                    <div className="mt-4 pt-4 border-t border-blue-100">
                      <p className="text-xs text-gray-500">Payment Method</p>
                      <p className="text-sm font-semibold text-gray-800">{order.paymentMethod}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}