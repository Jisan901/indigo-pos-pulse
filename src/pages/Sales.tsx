import React, { useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { 
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  EyeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Sale {
  id: string;
  date: string;
  customer: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  paymentMethod: 'cash' | 'card';
  cashier: string;
}

const Sales: React.FC = () => {
  const [sales] = useState<Sale[]>([
    {
      id: '#001',
      date: '2024-01-15 14:30',
      customer: 'John Doe',
      items: [
        { name: 'Coffee Bean Bag', quantity: 2, price: 12.99 },
        { name: 'Energy Drink', quantity: 1, price: 3.49 }
      ],
      total: 29.47,
      paymentMethod: 'card',
      cashier: 'Admin'
    },
    {
      id: '#002',
      date: '2024-01-15 13:15',
      customer: 'Jane Smith',
      items: [
        { name: 'Chocolate Bar', quantity: 3, price: 2.99 },
        { name: 'Water Bottle', quantity: 2, price: 1.49 }
      ],
      total: 11.95,
      paymentMethod: 'cash',
      cashier: 'Cashier'
    },
    {
      id: '#003',
      date: '2024-01-15 12:45',
      customer: 'Mike Johnson',
      items: [
        { name: 'Protein Bar', quantity: 1, price: 4.99 },
        { name: 'Potato Chips', quantity: 2, price: 1.99 }
      ],
      total: 8.97,
      paymentMethod: 'card',
      cashier: 'Admin'
    }
  ]);

  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.cashier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || sale.date.includes(dateFilter);
    return matchesSearch && matchesDate;
  });

  const handleExport = () => {
    // Mock export functionality
    console.log('Exporting sales data...');
  };

  const getTotalRevenue = () => {
    return filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  };

  const statCards = [
    {
      title: "Total Sales",
      value: filteredSales.length.toString(),
      icon: ShoppingCartIcon
    },
    {
      title: "Total Revenue",
      value: `$${getTotalRevenue().toFixed(2)}`,
      icon: CurrencyDollarIcon
    },
    {
      title: "Average Sale",
      value: `$${filteredSales.length > 0 ? (getTotalRevenue() / filteredSales.length).toFixed(2) : '0.00'}`,
      icon: ChartBarIcon
    }
  ];

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gemini-text-primary mb-2">Sales Reports</h1>
            <p className="text-gemini-text-secondary">View and analyze your sales history</p>
          </div>
          <button
            onClick={handleExport}
            className="neon-button flex items-center gap-2"
          >
            <DocumentArrowDownIcon className="w-5 h-5" />
            Export Data
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gemini-text-muted text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-gemini-text-primary">{stat.value}</p>
                  </div>
                  <IconComponent className="w-8 h-8 text-gemini-text-muted" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Search and Filters */}
        <div className="glass-card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by sale ID, customer, or cashier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-gemini-bg border border-gemini-indigo/30 rounded-lg text-gemini-text-primary placeholder-gemini-text-muted focus:outline-none focus:ring-2 focus:ring-gemini-neon focus:border-transparent"
              />
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gemini-text-muted" />
            </div>
            
            <div>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-3 bg-gemini-bg border border-gemini-indigo/30 rounded-lg text-gemini-text-primary focus:outline-none focus:ring-2 focus:ring-gemini-neon focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Sales Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gemini-surface/50">
                <tr>
                  <th className="text-left p-4 text-gemini-text-primary font-semibold">Sale ID</th>
                  <th className="text-left p-4 text-gemini-text-primary font-semibold">Date & Time</th>
                  <th className="text-left p-4 text-gemini-text-primary font-semibold">Customer</th>
                  <th className="text-left p-4 text-gemini-text-primary font-semibold">Items</th>
                  <th className="text-left p-4 text-gemini-text-primary font-semibold">Total</th>
                  <th className="text-left p-4 text-gemini-text-primary font-semibold">Payment</th>
                  <th className="text-left p-4 text-gemini-text-primary font-semibold">Cashier</th>
                  <th className="text-left p-4 text-gemini-text-primary font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="border-t border-gemini-indigo/20 hover:bg-gemini-surface/30 transition-colors duration-200">
                    <td className="p-4 text-gemini-text-primary font-mono font-semibold">{sale.id}</td>
                    <td className="p-4 text-gemini-text-secondary">{sale.date}</td>
                    <td className="p-4 text-gemini-text-primary">{sale.customer}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-gemini-indigo/20 text-gemini-indigo-light rounded-full text-xs">
                        {sale.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </span>
                    </td>
                    <td className="p-4 text-gemini-neon font-semibold">${sale.total.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sale.paymentMethod === 'cash' 
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {sale.paymentMethod.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-gemini-text-secondary">{sale.cashier}</td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedSale(sale)}
                        className="px-3 py-1 bg-gemini-indigo/20 text-gemini-indigo-light rounded hover:bg-gemini-indigo/30 transition-colors duration-200 flex items-center gap-1"
                      >
                        <EyeIcon className="w-4 h-4" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sale Details Modal */}
        {selectedSale && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="glass-card p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gemini-text-primary">Sale Details</h2>
                <button
                  onClick={() => setSelectedSale(null)}
                  className="text-gemini-text-muted hover:text-gemini-text-primary"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-gemini-text-muted text-sm">Sale ID</p>
                  <p className="text-gemini-text-primary font-semibold">{selectedSale.id}</p>
                </div>
                <div>
                  <p className="text-gemini-text-muted text-sm">Date & Time</p>
                  <p className="text-gemini-text-primary font-semibold">{selectedSale.date}</p>
                </div>
                <div>
                  <p className="text-gemini-text-muted text-sm">Customer</p>
                  <p className="text-gemini-text-primary font-semibold">{selectedSale.customer}</p>
                </div>
                <div>
                  <p className="text-gemini-text-muted text-sm">Cashier</p>
                  <p className="text-gemini-text-primary font-semibold">{selectedSale.cashier}</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gemini-text-primary mb-4">Items Purchased</h3>
                <div className="bg-gemini-bg/50 rounded-lg p-4">
                  {selectedSale.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gemini-indigo/20 last:border-b-0">
                      <div>
                        <p className="text-gemini-text-primary font-medium">{item.name}</p>
                        <p className="text-gemini-text-muted text-sm">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-gemini-neon font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-gemini-surface/50 rounded-lg">
                <div>
                  <p className="text-gemini-text-muted text-sm">Payment Method</p>
                  <p className="text-gemini-text-primary font-semibold capitalize">{selectedSale.paymentMethod}</p>
                </div>
                <div className="text-right">
                  <p className="text-gemini-text-muted text-sm">Total Amount</p>
                  <p className="text-2xl font-bold text-gemini-neon">${selectedSale.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Sales;
