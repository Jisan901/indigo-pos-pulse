
import React, { useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

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
      <div className="flex h-full gap-6 animate-fade-in">
        {/* Products Section */}
        <div className="flex-1 flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gemini-text-primary mb-4">Point of Sale</h1>
            
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-gemini-surface border border-gemini-indigo/30 rounded-lg text-gemini-text-primary placeholder-gemini-text-muted focus:outline-none focus:ring-2 focus:ring-gemini-neon focus:border-transparent"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gemini-text-muted">
                🔍
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="glass-card p-4 cursor-pointer hover:shadow-neon-sm transition-all duration-300 transform hover:scale-105"
                  onClick={() => handleAddToCart(product)}
                >
                  <div className="aspect-square bg-gemini-bg rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl">📦</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gemini-text-primary text-sm mb-1">{product.name}</h3>
                  <p className="text-gemini-text-muted text-xs mb-2">{product.sku}</p>
                  <p className="text-gemini-neon font-bold">${product.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Section */}
        <div className="w-96 flex flex-col">
          <div className="glass-card p-6 flex-1 flex flex-col">
            <h2 className="text-xl font-semibold text-gemini-text-primary mb-4">Current Sale</h2>
            
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto mb-4">
              {state.items.length === 0 ? (
                <div className="text-center text-gemini-text-muted py-8">
                  <div className="text-4xl mb-2">🛒</div>
                  <p>Cart is empty</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gemini-bg/50 rounded-lg">
                      <div className="w-12 h-12 bg-gemini-surface rounded-lg flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <span className="text-sm">📦</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gemini-text-primary text-sm">{item.name}</h4>
                        <p className="text-gemini-text-muted text-xs">{item.sku}</p>
                        <p className="text-gemini-neon text-sm font-semibold">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 bg-gemini-indigo rounded text-white text-xs hover:bg-gemini-indigo-light"
                        >
                          -
                        </button>
                        <span className="text-gemini-text-primary font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 bg-gemini-indigo rounded text-white text-xs hover:bg-gemini-indigo-light"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-6 h-6 bg-red-500 rounded text-white text-xs hover:bg-red-600 ml-2"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Totals */}
            {state.items.length > 0 && (
              <div className="border-t border-gemini-indigo/20 pt-4 space-y-2">
                <div className="flex justify-between text-gemini-text-secondary">
                  <span>Subtotal:</span>
                  <span>${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gemini-text-secondary">
                  <span>Tax (8%):</span>
                  <span>${(getSubtotal() * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gemini-neon">
                  <span>Total:</span>
                  <span>${getFinalTotal().toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-4 space-y-3">
              <button
                onClick={handleCheckout}
                disabled={state.items.length === 0}
                className="w-full neon-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Checkout ${getFinalTotal().toFixed(2)}
              </button>
              <button
                onClick={clearCart}
                disabled={state.items.length === 0}
                className="w-full px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gemini-text-primary mb-6">Process Payment</h2>
            
            <div className="mb-6">
              <p className="text-gemini-text-secondary mb-2">Total Amount:</p>
              <p className="text-3xl font-bold text-gemini-neon">${getFinalTotal().toFixed(2)}</p>
            </div>

            <div className="mb-6">
              <p className="text-gemini-text-secondary mb-3">Payment Method:</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    paymentMethod === 'cash'
                      ? 'border-gemini-neon bg-gemini-neon/20 text-gemini-neon'
                      : 'border-gemini-indigo/30 text-gemini-text-secondary hover:border-gemini-indigo'
                  }`}
                >
                  <div className="text-2xl mb-1">💵</div>
                  <div className="font-medium">Cash</div>
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    paymentMethod === 'card'
                      ? 'border-gemini-neon bg-gemini-neon/20 text-gemini-neon'
                      : 'border-gemini-indigo/30 text-gemini-text-secondary hover:border-gemini-indigo'
                  }`}
                >
                  <div className="text-2xl mb-1">💳</div>
                  <div className="font-medium">Card</div>
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-2 bg-gemini-surface text-gemini-text-secondary rounded-lg hover:bg-gemini-card transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="flex-1 neon-button"
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
