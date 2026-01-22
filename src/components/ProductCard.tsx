import { ShoppingCart, Package } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="relative overflow-hidden h-64">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-md">
          <span className="text-sm font-semibold text-gray-700">₱{product.price.toLocaleString()}</span>
        </div>
        {product.stock < 10 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full shadow-md text-xs font-bold">
            Only {product.stock} left!
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-green-600">
            <Package size={16} />
            <span className="text-sm font-medium">{product.stock} in stock</span>
          </div>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
            product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-95'
          }`}
        >
          <ShoppingCart size={20} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
