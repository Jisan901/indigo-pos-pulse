import React, { useState, useMemo } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { 
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  EyeIcon,
  XMarkIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";

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

type SortField = 'id' | 'date' | 'customer' | 'total' | 'paymentMethod' | 'cashier';
type SortOrder = 'asc' | 'desc';

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
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronUpDownIcon className="w-4 h-4 text-gemini-text-muted" />;
    }
    return sortOrder === 'asc' 
      ? <ChevronUpIcon className="w-4 h-4 text-gemini-neon" />
      : <ChevronDownIcon className="w-4 h-4 text-gemini-neon" />;
  };

  const sortedAndFilteredSales = useMemo(() => {
    let filtered = sales.filter(sale => {
      const matchesSearch = sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sale.cashier.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = !dateFilter || sale.date.includes(dateFilter);
      return matchesSearch && matchesDate;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let valueA: string | number = a[sortField];
      let valueB: string | number = b[sortField];

      if (sortField === 'total') {
        valueA = a.total;
        valueB = b.total;
      } else if (sortField === 'date') {
        valueA = new Date(a.date).getTime();
        valueB = new Date(b.date).getTime();
      } else {
        valueA = String(valueA).toLowerCase();
        valueB = String(valueB).toLowerCase();
      }

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [sales, searchTerm, dateFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedAndFilteredSales.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSales = sortedAndFilteredSales.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = () => {
    // Mock export functionality
    console.log('Exporting sales data...');
  };

  const getTotalRevenue = () => {
    return sortedAndFilteredSales.reduce((sum, sale) => sum + sale.total, 0);
  };

  const statCards = [
    {
      title: "Total Sales",
      value: sortedAndFilteredSales.length.toString(),
      icon: ShoppingCartIcon
    },
    {
      title: "Total Revenue",
      value: `$${getTotalRevenue().toFixed(2)}`,
      icon: CurrencyDollarIcon
    },
    {
      title: "Average Sale",
      value: `$${sortedAndFilteredSales.length > 0 ? (getTotalRevenue() / sortedAndFilteredSales.length).toFixed(2) : '0.00'}`,
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

        {/* Search, Filters, and Controls */}
        <div className="glass-card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
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

            <div>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => { setItemsPerPage(Number(value)); setCurrentPage(1); }}>
                <SelectTrigger className="bg-gemini-bg border-gemini-indigo/30 text-gemini-text-primary">
                  <SelectValue placeholder="Items per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="25">25 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Sales Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gemini-surface/50">
                <tr>
                  <th className="text-left p-4">
                    <button
                      onClick={() => handleSort('id')}
                      className="flex items-center gap-2 text-gemini-text-primary font-semibold hover:text-gemini-neon transition-colors"
                    >
                      Sale ID
                      {getSortIcon('id')}
                    </button>
                  </th>
                  <th className="text-left p-4">
                    <button
                      onClick={() => handleSort('date')}
                      className="flex items-center gap-2 text-gemini-text-primary font-semibold hover:text-gemini-neon transition-colors"
                    >
                      Date & Time
                      {getSortIcon('date')}
                    </button>
                  </th>
                  <th className="text-left p-4">
                    <button
                      onClick={() => handleSort('customer')}
                      className="flex items-center gap-2 text-gemini-text-primary font-semibold hover:text-gemini-neon transition-colors"
                    >
                      Customer
                      {getSortIcon('customer')}
                    </button>
                  </th>
                  <th className="text-left p-4 text-gemini-text-primary font-semibold">Items</th>
                  <th className="text-left p-4">
                    <button
                      onClick={() => handleSort('total')}
                      className="flex items-center gap-2 text-gemini-text-primary font-semibold hover:text-gemini-neon transition-colors"
                    >
                      Total
                      {getSortIcon('total')}
                    </button>
                  </th>
                  <th className="text-left p-4">
                    <button
                      onClick={() => handleSort('paymentMethod')}
                      className="flex items-center gap-2 text-gemini-text-primary font-semibold hover:text-gemini-neon transition-colors"
                    >
                      Payment
                      {getSortIcon('paymentMethod')}
                    </button>
                  </th>
                  <th className="text-left p-4">
                    <button
                      onClick={() => handleSort('cashier')}
                      className="flex items-center gap-2 text-gemini-text-primary font-semibold hover:text-gemini-neon transition-colors"
                    >
                      Cashier
                      {getSortIcon('cashier')}
                    </button>
                  </th>
                  <th className="text-left p-4 text-gemini-text-primary font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSales.map((sale) => (
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gemini-indigo/20">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gemini-text-secondary">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedAndFilteredSales.length)} of {sortedAndFilteredSales.length} results
                </p>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNum)}
                            isActive={currentPage === pageNum}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    {totalPages > 5 && <PaginationEllipsis />}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
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
