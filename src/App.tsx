import { useState, useEffect } from 'react';
import { ShoppingCart, Store, Search, Filter, History, Mail, MapPin, Phone, HelpCircle, Info, ArrowLeft } from 'lucide-react';
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import Toast from './components/Toast';
import CheckoutPage from './components/CheckoutPage';
import OrdersPage from './components/OrdersPage';
import { products } from './data/products';
import { CartItem, Product, ShippingInfo, Order } from './types';

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'shop' | 'checkout' | 'orders' | 'faq' | 'about' | 'contact'>('shop');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedCart = localStorage.getItem('tomishop-cart');
    const savedOrders = localStorage.getItem('tomishop-orders');
    if (savedCart) setCartItems(JSON.parse(savedCart));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  useEffect(() => {
    localStorage.setItem('tomishop-cart', JSON.stringify(cartItems));
    localStorage.setItem('tomishop-orders', JSON.stringify(orders));
  }, [cartItems, orders]);

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          setToast({ message: 'Maximum stock reached!', type: 'error' });
          return prev;
        }
        setToast({ message: 'Quantity updated!', type: 'success' });
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      setToast({ message: 'Added to cart!', type: 'success' });
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    setToast({ message: 'Item removed from cart', type: 'info' });
  };

  const clearCart = () => {
    setCartItems([]);
    setToast({ message: 'Cart cleared', type: 'info' });
  };

  const handleCompleteOrder = (shippingInfo: ShippingInfo, paymentMethod: string) => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.12;
    const shippingFee = subtotal > 5000 ? 0 : 150;
    const total = subtotal + tax + shippingFee;

    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      date: new Date().toLocaleDateString('en-PH', { 
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      }),
      items: [...cartItems],
      total: total,
      shippingInfo,
      paymentMethod
    };

    setOrders([newOrder, ...orders]);
    setCartItems([]);
    setCurrentPage('orders');
    setToast({ message: 'Order placed successfully!', type: 'success' });
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage('shop');
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const categories = ['All', ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3 cursor-pointer" onClick={handleLogoClick}>
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-xl shadow-lg">
                <Store className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Tomishop
                </h1>
                <p className="text-xs text-gray-500">Your Modern Store</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setCurrentPage('orders')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentPage === 'orders' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <History size={20} />
                <span className="hidden md:inline">My Orders</span>
              </button>

              {currentPage === 'shop' && (
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition-all duration-300 hover:shadow-lg active:scale-95"
                >
                  <ShoppingCart size={24} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
                      {totalItems}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 w-full">
        {currentPage === 'orders' ? (
          <OrdersPage orders={orders} onBack={() => setCurrentPage('shop')} />
        ) : currentPage === 'checkout' ? (
          <CheckoutPage 
            cartItems={cartItems} 
            onBack={() => setCurrentPage('shop')} 
            onCompleteOrder={handleCompleteOrder}
          />
        ) : currentPage === 'about' ? (
          <div className="animate-fade-in max-w-3xl mx-auto">
            <button onClick={() => setCurrentPage('shop')} className="flex items-center gap-2 text-blue-600 mb-8 hover:underline">
              <ArrowLeft size={20} /> Back to Shop
            </button>
            <h2 className="text-4xl font-bold mb-6">About Tomishop</h2>
            <div className="bg-white p-8 rounded-2xl shadow-sm space-y-4 text-gray-700 leading-relaxed">
              <p>Welcome to Tomishop, your premier destination for high-quality electronics and lifestyle gear. Founded in 2024, we aim to bridge the gap between innovation and affordability.</p>
              <p>Our mission is simple: to provide our customers with a curated selection of the best products on the market, backed by exceptional customer service and a seamless shopping experience.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-bold text-gray-900">Quality Assured</h4>
                  <p className="text-sm">Every item is checked for quality and performance before it reaches your doorstep.</p>
                </div>
                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-bold text-gray-900">Fast Delivery</h4>
                  <p className="text-sm">We partner with top logistics providers to ensure your orders arrive quickly and safely.</p>
                </div>
              </div>
            </div>
          </div>
        ) : currentPage === 'faq' ? (
          <div className="animate-fade-in max-w-3xl mx-auto">
            <button onClick={() => setCurrentPage('shop')} className="flex items-center gap-2 text-blue-600 mb-8 hover:underline">
              <ArrowLeft size={20} /> Back to Shop
            </button>
            <h2 className="text-4xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "How long does shipping take?", a: "Standard shipping takes 3-5 business days within Metro Manila and 5-10 days for provincial areas." },
                { q: "What is your return policy?", a: "We offer a 7-day return policy for manufacturing defects. Items must be in original packaging." },
                { q: "Do you offer cash on delivery?", a: "Yes, COD is available for most locations nationwide." },
                { q: "How can I track my order?", a: "Once shipped, you will receive a tracking number via email or you can check your 'My Orders' section." }
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                  <h4 className="font-bold text-lg mb-2 text-blue-700 flex items-center gap-2">
                    <HelpCircle size={18} /> {item.q}
                  </h4>
                  <p className="text-gray-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        ) : currentPage === 'contact' ? (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <button onClick={() => setCurrentPage('shop')} className="flex items-center gap-2 text-blue-600 mb-8 hover:underline">
              <ArrowLeft size={20} /> Back to Shop
            </button>
            <h2 className="text-4xl font-bold mb-6 text-center">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm space-y-6">
                <h3 className="text-2xl font-bold">Get in Touch</h3>
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Mail size={24} /></div>
                  <div><p className="font-bold">Email</p><p className="text-gray-600">support@tomishop.com</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Phone size={24} /></div>
                  <div><p className="font-bold">Phone</p><p className="text-gray-600">+63 912 345 6789</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600"><MapPin size={24} /></div>
                  <div><p className="font-bold">Address</p><p className="text-gray-600">Makati City, Metro Manila, Philippines</p></div>
                </div>
              </div>
              <form className="bg-white p-8 rounded-2xl shadow-sm space-y-4" onSubmit={(e) => { e.preventDefault(); setToast({message: 'Message sent!', type: 'success'})}}>
                <div><label className="block font-semibold mb-1">Name</label><input type="text" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-200" placeholder="Your Name" required /></div>
                <div><label className="block font-semibold mb-1">Email</label><input type="email" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-200" placeholder="your@email.com" required /></div>
                <div><label className="block font-semibold mb-1">Message</label><textarea className="w-full p-3 border rounded-lg h-32 outline-none focus:ring-2 focus:ring-blue-200" placeholder="How can we help?" required></textarea></div>
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">Send Message</button>
              </form>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Welcome to <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Tomishop</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover amazing products at unbeatable prices. Quality guaranteed!
              </p>
            </div>

            <div className="mb-8 space-y-4">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>

              <div className="flex items-center justify-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-gray-600">
                  <Filter size={20} />
                  <span className="font-semibold">Filter:</span>
                </div>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-2xl text-gray-500">No products found</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Simplified Footer as requested */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Store size={24} className="text-blue-400" />
                <h3 className="text-2xl font-bold">Tomishop</h3>
              </div>
              <p className="text-gray-400">Your trusted online shopping destination</p>
              <p className="text-gray-500 text-sm mt-4">&copy; 2024 Tomishop. All rights reserved.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8">
              <button onClick={() => { setCurrentPage('about'); window.scrollTo(0,0); }} className="hover:text-blue-400 transition-colors flex items-center gap-2">
                <Info size={18} /> About Us
              </button>
              <button onClick={() => { setCurrentPage('faq'); window.scrollTo(0,0); }} className="hover:text-blue-400 transition-colors flex items-center gap-2">
                <HelpCircle size={18} /> FAQ
              </button>
              <button onClick={() => { setCurrentPage('contact'); window.scrollTo(0,0); }} className="hover:text-blue-400 transition-colors flex items-center gap-2">
                <Mail size={18} /> Contact Page
              </button>
            </div>
          </div>
        </div>
      </footer>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onClearCart={clearCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setCurrentPage('checkout');
        }}
      />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}

export default App;