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
  CubeIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

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

  const categories = [...new Set(products.map(p => p.category))];

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

  const handleCashPayment = () => {
    navigate('/cash-payment');
  };

  const handleCardPayment = () => {
    toast.success(`Card payment of $${getFinalTotal().toFixed(2)} processed successfully!`);
    clearCart();
    setShowPaymentModal(false);
  };

  return (
    <MainLayout>
      <div className="h-full flex flex-col bg-gemini-bg text-gemini-text-primary overflow-hidden">
        {/* Header */}
        <div className="glass-card border-b border-gemini-indigo/20 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gemini-text-primary mb-1">Point of Sale</h1>
              <p className="text-gemini-text-secondary">Manage your sales and inventory</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex bg-gemini-surface rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-gemini-indigo text-white' 
                      : 'text-gemini-text-secondary hover:text-gemini-neon'
                  }`}
                >
                  <Squares2X2Icon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-gemini-indigo text-white' 
                      : 'text-gemini-text-secondary hover:text-gemini-neon'
                  }`}
                >
                  <ListBulletIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Search and Filters */}
            <div className="glass-card border-b border-gemini-indigo/20 p-6 flex-shrink-0">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gemini-text-muted" />
                  <input
                    type="text"
                    placeholder="Search products by name or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gemini-surface border border-gemini-indigo/20 rounded-lg focus:ring-2 focus:ring-gemini-neon focus:border-gemini-neon transition-colors text-gemini-text-primary placeholder-gemini-text-muted"
                  />
                </div>
                <select className="px-4 py-3 bg-gemini-surface border border-gemini-indigo/20 rounded-lg focus:ring-2 focus:ring-gemini-neon focus:border-gemini-neon text-gemini-text-primary">
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products */}
            <div className="flex-1 p-6 overflow-y-auto">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="glass-card p-4 hover:border-gemini-neon/40 transition-all duration-200 cursor-pointer group"
                      onClick={() => handleAddToCart(product)}
                    >
                      <div className="aspect-square bg-gemini-surface rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                          />
                        ) : (
                          <CubeIcon className="w-12 h-12 text-gemini-text-muted" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gemini-text-primary text-sm mb-1 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gemini-text-muted mb-3">{product.sku}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gemini-neon">
                            ${product.price.toFixed(2)}
                          </span>
                          <div className="w-8 h-8 bg-gemini-indigo/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <PlusIcon className="w-4 h-4 text-gemini-neon" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="glass-card p-4 hover:border-gemini-neon/40 transition-all duration-200 cursor-pointer group"
                      onClick={() => handleAddToCart(product)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gemini-surface rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <CubeIcon className="w-6 h-6 text-gemini-text-muted" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gemini-text-primary text-sm truncate">{product.name}</h3>
                          <p className="text-xs text-gemini-text-muted">{product.sku} • {product.category}</p>
                        </div>
                        <div className="text-right flex items-center gap-3 flex-shrink-0">
                          <span className="text-lg font-bold text-gemini-neon">${product.price.toFixed(2)}</span>
                          <div className="w-8 h-8 bg-gemini-indigo/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <PlusIcon className="w-4 h-4 text-gemini-neon" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cart Sidebar - Made more compact */}
          <div className="w-80 glass-card border-l border-gemini-indigo/20 flex flex-col flex-shrink-0">
            {/* Cart Header - Reduced padding */}
            <div className="p-4 border-b border-gemini-indigo/20 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gemini-indigo/20 rounded-lg flex items-center justify-center">
                  <ShoppingCartIcon className="w-4 h-4 text-gemini-neon" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gemini-text-primary">Current Order</h2>
                  <p className="text-xs text-gemini-text-secondary">{state.items.length} items</p>
                </div>
              </div>
            </div>
            
            {/* Cart Items - Made more compact */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {state.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <div className="w-16 h-16 bg-gemini-surface rounded-full flex items-center justify-center mb-3">
                    <ShoppingCartIcon className="w-8 h-8 text-gemini-text-muted" />
                  </div>
                  <h3 className="font-medium text-gemini-text-primary mb-1 text-sm">Your cart is empty</h3>
                  <p className="text-gemini-text-secondary text-xs">Add products to get started</p>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {state.items.map((item) => (
                    <div key={item.id} className="bg-gemini-surface/50 rounded-lg p-2 border border-gemini-indigo/10">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gemini-card rounded flex items-center justify-center border border-gemini-indigo/20 flex-shrink-0 overflow-hidden">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded" />
                          ) : (
                            <CubeIcon className="w-4 h-4 text-gemini-text-muted" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gemini-text-primary text-xs mb-0.5 truncate">{item.name}</h4>
                          <p className="text-xs text-gemini-text-muted">{item.sku}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeItem(item.id);
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors p-1"
                        >
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-semibold text-gemini-neon">
                          ${item.price.toFixed(2)}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(item.id, item.quantity - 1);
                            }}
                            className="w-6 h-6 bg-gemini-surface hover:bg-gemini-indigo/20 rounded flex items-center justify-center transition-colors"
                          >
                            <MinusIcon className="w-3 h-3 text-gemini-text-secondary" />
                          </button>
                          <span className="text-sm font-semibold text-gemini-text-primary w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(item.id, item.quantity + 1);
                            }}
                            className="w-6 h-6 bg-gemini-indigo/20 hover:bg-gemini-indigo/30 rounded flex items-center justify-center transition-colors"
                          >
                            <PlusIcon className="w-3 h-3 text-gemini-neon" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer - Made more compact */}
            {state.items.length > 0 && (
              <div className="border-t border-gemini-indigo/20 p-4 bg-gemini-surface/30 flex-shrink-0">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs text-gemini-text-secondary">
                    <span>Subtotal:</span>
                    <span className="font-medium text-gemini-text-primary">${getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gemini-text-secondary">
                    <span>Tax (8%):</span>
                    <span className="font-medium text-gemini-text-primary">${(getSubtotal() * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gemini-indigo/20 pt-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-bold text-gemini-text-primary">Total:</span>
                      <span className="text-lg font-bold text-gemini-neon">${getFinalTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleCheckout}
                    className="neon-button w-full py-2 px-3 rounded-lg shadow-lg shadow-gemini-indigo/20 text-xs"
                  >
                    Checkout • ${getFinalTotal().toFixed(2)}
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full bg-gemini-surface hover:bg-gemini-card text-gemini-text-primary font-medium py-1.5 px-3 rounded-lg border border-gemini-indigo/20 transition-colors text-xs"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-gemini-indigo to-gemini-neon p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Complete Payment</h2>
              <p className="text-blue-100">Select payment method</p>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-8">
                <p className="text-gemini-text-secondary mb-2">Total Amount</p>
                <p className="text-4xl font-bold text-gemini-text-primary">${getFinalTotal().toFixed(2)}</p>
              </div>

              <div className="mb-8">
                <p className="text-gemini-text-primary font-medium mb-4">Select Payment Method</p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleCashPayment}
                    className="p-4 rounded-xl border-2 border-gemini-indigo/20 text-gemini-text-secondary hover:border-gemini-neon/40 hover:bg-gemini-neon/10 hover:text-gemini-neon transition-all duration-200 flex flex-col items-center gap-3"
                  >
                    <CurrencyDollarIcon className="w-8 h-8" />
                    <span className="font-medium">Cash</span>
                  </button>
                  <button
                    onClick={handleCardPayment}
                    className="p-4 rounded-xl border-2 border-gemini-indigo/20 text-gemini-text-secondary hover:border-gemini-neon/40 hover:bg-gemini-neon/10 hover:text-gemini-neon transition-all duration-200 flex flex-col items-center gap-3"
                  >
                    <CreditCardIcon className="w-8 h-8" />
                    <span className="font-medium">Card</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 py-3 px-6 bg-gemini-surface hover:bg-gemini-card text-gemini-text-primary font-medium rounded-xl border border-gemini-indigo/20 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default POS;
