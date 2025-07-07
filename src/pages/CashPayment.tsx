
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { 
  ArrowLeftIcon,
  CurrencyDollarIcon,
  CheckIcon,
  XMarkIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const CashPayment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart, getFinalTotal } = useCart();
  
  const [amountReceived, setAmountReceived] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Customer data fields
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  
  const totalAmount = getFinalTotal();
  const receivedAmount = parseFloat(amountReceived) || 0;
  const changeAmount = receivedAmount - totalAmount;
  const isValidPayment = receivedAmount >= totalAmount;

  const handleBackToPOS = () => {
    navigate('/pos');
  };

  const handleCustomerDataChange = (field: string, value: string) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProcessPayment = async () => {
    if (!isValidPayment) {
      toast.error('Insufficient payment amount');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const customerInfo = customerData.name ? ` for ${customerData.name}` : '';
    toast.success(`Payment of $${totalAmount.toFixed(2)} processed successfully${customerInfo}!`);
    clearCart();
    navigate('/pos');
  };

  const quickAmountButtons = [
    { label: '$20', value: 20 },
    { label: '$50', value: 50 },
    { label: '$100', value: 100 },
    { label: 'Exact', value: totalAmount }
  ];

  return (
    <div className="min-h-screen bg-gemini-bg text-gemini-text-primary">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleBackToPOS}
            className="w-10 h-10 bg-gemini-surface hover:bg-gemini-card rounded-lg flex items-center justify-center transition-colors border border-gemini-indigo/20"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gemini-text-secondary" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gemini-text-primary">Cash Payment</h1>
            <p className="text-gemini-text-secondary">Process cash transaction</p>
          </div>
        </div>

        {/* Customer Information Card */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gemini-indigo/20 rounded-lg flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-gemini-neon" />
            </div>
            <h2 className="text-lg font-semibold text-gemini-text-primary">Customer Information</h2>
            <span className="text-sm text-gemini-text-secondary">(Optional)</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gemini-text-secondary mb-2">
                Name
              </label>
              <Input
                id="customerName"
                type="text"
                value={customerData.name}
                onChange={(e) => handleCustomerDataChange('name', e.target.value)}
                placeholder="Customer name"
                className="bg-gemini-surface border-gemini-indigo/20 focus:border-gemini-neon"
              />
            </div>
            <div>
              <label htmlFor="customerPhone" className="block text-sm font-medium text-gemini-text-secondary mb-2">
                Phone
              </label>
              <Input
                id="customerPhone"
                type="tel"
                value={customerData.phone}
                onChange={(e) => handleCustomerDataChange('phone', e.target.value)}
                placeholder="Phone number"
                className="bg-gemini-surface border-gemini-indigo/20 focus:border-gemini-neon"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="customerEmail" className="block text-sm font-medium text-gemini-text-secondary mb-2">
                Email
              </label>
              <Input
                id="customerEmail"
                type="email"
                value={customerData.email}
                onChange={(e) => handleCustomerDataChange('email', e.target.value)}
                placeholder="Email address"
                className="bg-gemini-surface border-gemini-indigo/20 focus:border-gemini-neon"
              />
            </div>
          </div>
        </div>

        {/* Payment Summary Card */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gemini-indigo/20 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="w-5 h-5 text-gemini-neon" />
            </div>
            <h2 className="text-lg font-semibold text-gemini-text-primary">Payment Summary</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gemini-text-secondary">Total Amount:</span>
              <span className="font-semibold text-gemini-text-primary">${totalAmount.toFixed(2)}</span>
            </div>
            <div className="border-t border-gemini-indigo/20 pt-3">
              <div className="flex justify-between">
                <span className="text-lg font-bold text-gemini-text-primary">Amount Due:</span>
                <span className="text-2xl font-bold text-gemini-neon">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cash Input Card */}
        <div className="glass-card p-6 mb-6">
          <h3 className="text-lg font-semibold text-gemini-text-primary mb-4">Cash Received</h3>
          
          <div className="mb-4">
            <label htmlFor="cashAmount" className="block text-sm font-medium text-gemini-text-secondary mb-2">
              Enter amount received
            </label>
            <Input
              id="cashAmount"
              type="number"
              step="0.01"
              min="0"
              value={amountReceived}
              onChange={(e) => setAmountReceived(e.target.value)}
              placeholder="0.00"
              className="text-lg h-12 bg-gemini-surface border-gemini-indigo/20 focus:border-gemini-neon"
            />
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {quickAmountButtons.map((button) => (
              <button
                key={button.label}
                onClick={() => setAmountReceived(button.value.toString())}
                className="py-3 px-4 bg-gemini-surface hover:bg-gemini-indigo/20 border border-gemini-indigo/20 rounded-lg text-gemini-text-primary font-medium transition-colors"
              >
                {button.label}
              </button>
            ))}
          </div>

          {/* Change Calculation */}
          {receivedAmount > 0 && (
            <div className="bg-gemini-surface/50 rounded-lg p-4 border border-gemini-indigo/20">
              <div className="flex justify-between items-center">
                <span className="text-gemini-text-secondary">Change Due:</span>
                <div className="flex items-center gap-2">
                  {isValidPayment ? (
                    <CheckIcon className="w-5 h-5 text-green-400" />
                  ) : (
                    <XMarkIcon className="w-5 h-5 text-red-400" />
                  )}
                  <span className={`text-lg font-bold ${
                    isValidPayment ? 'text-green-400' : 'text-red-400'
                  }`}>
                    ${changeAmount >= 0 ? changeAmount.toFixed(2) : `Need $${Math.abs(changeAmount).toFixed(2)} more`}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleBackToPOS}
            variant="outline"
            className="flex-1 bg-gemini-surface hover:bg-gemini-card border-gemini-indigo/20 text-gemini-text-primary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleProcessPayment}
            disabled={!isValidPayment || isProcessing}
            className="flex-1 neon-button"
          >
            {isProcessing ? 'Processing...' : `Process Payment ($${totalAmount.toFixed(2)})`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CashPayment;
