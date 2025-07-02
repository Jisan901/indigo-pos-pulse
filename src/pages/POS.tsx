

import React, { useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { 
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  PlusIcon,
  MinusIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  CubeIcon
} from '@heroicons/react/24/outline';

interface Product {
  id: string;
  name: string;
  price: number;
  sku: string;
  image?: string;
  category: string;
}

const POS: React.FC = () => {
  const { state, addItem, removeItem, updateQuantity, clearCart, getSubtotal, getFinalTotal } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');

  // Mock products - replace with real data
  const products: Product[] = [
    { id: '1', name: 'Coffee Bean Bag', price: 12.99, sku: 'CB001', category: 'Beverages', image: 'https://images.unsplash.com/photo-1618160702438-9b02040d0a901?w=200&h=200&fit=crop' },
    { id: '2', name: 'Energy Drink', price: 3.49, sku: 'ED002', category: 'Beverages' },
    { id: '3', name: 'Chocolate Bar', price: 2.99, sku: 'CB003', category: 'Snacks' },
    { id: '4', name: 'Protein Bar', price: 4.99, sku: 'PB004', category: 'Health' },
    { id: '5', name: 'Potato Chips', price: 1.99, sku: 'PC005', category: 'Snacks' },
    { id: '6', name: 'Water Bottle', price: 1.49, sku: 'WB006', category: 'Beverages' },
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      sku: product.sku,
      image: product.image
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleCheckout = () => {
    if (state.items.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePayment = () => {
    // Mock payment processing
    toast.success(`Payment of $${getFinalTotal().toFixed(2)} processed successfully!`);
    clearCart();
    setShowPaymentModal(false);
    setPaymentMethod('cash');
  };

  return (
    <MainLayout>
      <div className="flex h-full gap-8 p-6">
        {/* Products Section */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-white">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Point of Sale</h1>
            
            {/* Search Bar */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:shadow-lg hover:border-blue-200 transition-all duration-200"
                  onClick={() => handleAddToCart(product)}
                >
                  <div className="aspect-square bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <CubeIcon className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{product.name}</h3>
                    <p className="text-gray-500 text-xs">{product.sku}</p>
                    <p className="text-blue-600 font-bold text-lg">${product.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Section */}
        <div className="w-96 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingCartIcon className="w-5 h-5 text-blue-600" />
              </div>
              Current Sale
            </h2>
          </div>
          
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCartIcon className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">Cart is empty</p>
                <p className="text-gray-400 text-sm mt-1">Add products to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <CubeIcon className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h4>
                      <p className="text-gray-500 text-xs">{item.sku}</p>
                      <p className="text-blue-600 text-sm font-semibold">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <MinusIcon className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="text-gray-900 font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-blue-100 hover:bg-blue-200 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <PlusIcon className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center ml-2 transition-colors"
                      >
                        <XMarkIcon className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Totals and Actions */}
          {state.items.length > 0 && (
            <div className="border-t border-gray-100 p-6 bg-gray-50">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%):</span>
                  <span className="font-semibold">${(getSubtotal() * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total:</span>
                    <span className="text-blue-600">${getFinalTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
                >
                  Checkout ${getFinalTotal().toFixed(2)}
                </button>
                <button
                  onClick={clearCart}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Process Payment</h2>
            
            <div className="mb-8">
              <p className="text-gray-600 mb-2">Total Amount:</p>
              <p className="text-4xl font-bold text-blue-600">${getFinalTotal().toFixed(2)}</p>
            </div>

            <div className="mb-8">
              <p className="text-gray-600 mb-4 font-semibold">Payment Method:</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${
                    paymentMethod === 'cash'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <CurrencyDollarIcon className="w-8 h-8" />
                  <span className="font-semibold">Cash</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${
                    paymentMethod === 'card'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <CreditCardIcon className="w-8 h-8" />
                  <span className="font-semibold">Card</span>
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
              >
                Process Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default POS;

