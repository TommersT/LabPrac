import { ArrowLeft, CreditCard, Wallet, Truck, CheckCircle2, MapPin, User, Phone } from 'lucide-react';
import { CartItem } from '../types';
import { useState } from 'react';

interface CheckoutPageProps {
  cartItems: CartItem[];
  onBack: () => void;
  onCompleteOrder: () => void;
}

type PaymentMethod = 'GCash' | 'COD' | 'Card';

export default function CheckoutPage({ cartItems, onBack, onCompleteOrder }: CheckoutPageProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('GCash');
  
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.12;
  const shippingFee = subtotal > 5000 ? 0 : 150;
  const total = subtotal + tax + shippingFee;

  const paymentOptions = [
    { id: 'GCash' as PaymentMethod, name: 'GCash', icon: <Wallet className="text-blue-500" /> },
    { id: 'COD' as PaymentMethod, name: 'Cash on Delivery', icon: <Truck className="text-orange-500" /> },
    { id: 'Card' as PaymentMethod, name: 'Credit / Debit Card', icon: <CreditCard className="text-purple-500" /> },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 font-semibold mb-8 hover:text-blue-700 transition-colors"
      >
        <ArrowLeft size={20} /> Back to Shop
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
              <MapPin className="text-blue-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Shipping Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="name"
                    value={shippingInfo.name}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    placeholder="0917 XXX XXXX"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                <textarea
                  name="address"
                  rows={3}
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  placeholder="House Number, Street, Barangay, City, Province"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Payment Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {paymentOptions.map((option) => (
                <label 
                  key={option.id}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === option.id 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="mb-2">{option.icon}</div>
                  <span className={`text-sm font-semibold text-center ${paymentMethod === option.id ? 'text-blue-700' : 'text-gray-700'}`}>
                    {option.name}
                  </span>
                  <input 
                    type="radio" 
                    name="payment" 
                    className="hidden"
                    checked={paymentMethod === option.id}
                    onChange={() => setPaymentMethod(option.id)}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Product Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 py-2 border-b border-gray-50 last:border-0">
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm line-clamp-1">{item.name}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="font-bold text-gray-900 text-sm">₱{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal</span>
                <span>₱{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Tax (12%)</span>
                <span>₱{tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₱${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 mt-2 border-t">
                <span>Total</span>
                <span className="text-blue-600">₱{total.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={onCompleteOrder}
              disabled={!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address}
              className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              <CheckCircle2 size={22} />
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}