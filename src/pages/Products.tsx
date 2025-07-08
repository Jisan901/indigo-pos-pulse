import React, { useState, useMemo } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { toast } from 'sonner';
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CubeIcon,
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

interface Product {
  id: string;
  name: string;
  price: number;
  sku: string;
  category: string;
  stock: number;
  image?: string;
}

type SortField = 'name' | 'price' | 'sku' | 'category' | 'stock';
type SortOrder = 'asc' | 'desc';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Coffee Bean Bag', price: 12.99, sku: 'CB001', category: 'Beverages', stock: 45 },
    { id: '2', name: 'Energy Drink', price: 3.49, sku: 'ED002', category: 'Beverages', stock: 120 },
    { id: '3', name: 'Chocolate Bar', price: 2.99, sku: 'CB003', category: 'Snacks', stock: 78 },
    { id: '4', name: 'Protein Bar', price: 4.99, sku: 'PB004', category: 'Health', stock: 32 },
    { id: '5', name: 'Potato Chips', price: 1.99, sku: 'PC005', category: 'Snacks', stock: 95 },
    { id: '6', name: 'Water Bottle', price: 1.49, sku: 'WB006', category: 'Beverages', stock: 200 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    sku: '',
    category: '',
    stock: '',
  });

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

  const sortedAndFilteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let valueA: string | number = a[sortField];
      let valueB: string | number = b[sortField];

      if (sortField === 'price' || sortField === 'stock') {
        valueA = Number(valueA);
        valueB = Number(valueB);
      } else {
        valueA = String(valueA).toLowerCase();
        valueB = String(valueB).toLowerCase();
      }

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [products, searchTerm, categoryFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedAndFilteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedAndFilteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const categories = Array.from(new Set(products.map(p => p.category)));

  const handleAddProduct = () => {
    setFormData({ name: '', price: '', sku: '', category: '', stock: '' });
    setEditingProduct(null);
    setShowAddModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      sku: product.sku,
      category: product.category,
      stock: product.stock.toString(),
    });
    setEditingProduct(product);
    setShowAddModal(true);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success('Product deleted successfully');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      // Update existing product
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? {
              ...p,
              name: formData.name,
              price: parseFloat(formData.price),
              sku: formData.sku,
              category: formData.category,
              stock: parseInt(formData.stock),
            }
          : p
      ));
      toast.success('Product updated successfully');
    } else {
      // Add new product
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name,
        price: parseFloat(formData.price),
        sku: formData.sku,
        category: formData.category,
        stock: parseInt(formData.stock),
      };
      setProducts([...products, newProduct]);
      toast.success('Product added successfully');
    }
    
    setShowAddModal(false);
    setFormData({ name: '', price: '', sku: '', category: '', stock: '' });
    setEditingProduct(null);
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gemini-text-primary mb-2">Products</h1>
            <p className="text-gemini-text-secondary">Manage your inventory and product catalog</p>
          </div>
          <button
            onClick={handleAddProduct}
            className="neon-button flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {/* Search, Filter, and Controls */}
        <div className="glass-card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <input
                type="text"
                placeholder="Search products by name, SKU, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-gemini-bg border border-gemini-indigo/30 rounded-lg text-gemini-text-primary placeholder-gemini-text-muted focus:outline-none focus:ring-2 focus:ring-gemini-neon focus:border-transparent"
              />
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gemini-text-muted" />
            </div>

            <div>
              <Select value={categoryFilter} onValueChange={(value) => { setCategoryFilter(value === 'all' ? '' : value); setCurrentPage(1); }}>
                <SelectTrigger className="bg-gemini-bg border-gemini-indigo/30 text-gemini-text-primary">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

        {/* Products Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gemini-surface/50">
                <tr>
                  <th className="text-left p-4">
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-2 text-gemini-text-primary font-semibold hover:text-gemini-neon transition-colors"
                    >
                      Product
                      {getSortIcon('name')}
                    </button>
                  </th>
                  <th className="text-left p-4">
                    <button
                      onClick={() => handleSort('sku')}
                      className="flex items-center gap-2 text-gemini-text-primary font-semibold hover:text-gemini-neon transition-colors"
                    >
                      SKU
                      {getSortIcon('sku')}
                    </button>
                  </th>
                  <th className="text-left p-4">
                    <button
                      onClick={() => handleSort('category')}
                      className="flex items-center gap-2 text-gemini-text-primary font-semibold hover:text-gemini-neon transition-colors"
                    >
                      Category
                      {getSortIcon('category')}
                    </button>
                  </th>
                  <th className="text-left p-4">
                    <button
                      onClick={() => handleSort('price')}
                      className="flex items-center gap-2 text-gemini-text-primary font-semibold hover:text-gemini-neon transition-colors"
                    >
                      Price
                      {getSortIcon('price')}
                    </button>
                  </th>
                  <th className="text-left p-4">
                    <button
                      onClick={() => handleSort('stock')}
                      className="flex items-center gap-2 text-gemini-text-primary font-semibold hover:text-gemini-neon transition-colors"
                    >
                      Stock
                      {getSortIcon('stock')}
                    </button>
                  </th>
                  <th className="text-left p-4 text-gemini-text-primary font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <tr key={product.id} className="border-t border-gemini-indigo/20 hover:bg-gemini-surface/30 transition-colors duration-200">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gemini-bg rounded-lg flex items-center justify-center">
                          <CubeIcon className="w-6 h-6 text-gemini-text-muted" />
                        </div>
                        <div>
                          <p className="font-medium text-gemini-text-primary">{product.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gemini-text-secondary font-mono">{product.sku}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-gemini-indigo/20 text-gemini-indigo-light rounded-full text-xs">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4 text-gemini-neon font-semibold">${product.price.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock > 50 
                          ? 'bg-green-500/20 text-green-400'
                          : product.stock > 10
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="px-3 py-1 bg-gemini-indigo/20 text-gemini-indigo-light rounded hover:bg-gemini-indigo/30 transition-colors duration-200 flex items-center gap-1"
                        >
                          <PencilIcon className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors duration-200 flex items-center gap-1"
                        >
                          <TrashIcon className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
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
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedAndFilteredProducts.length)} of {sortedAndFilteredProducts.length} results
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

        {/* Add/Edit Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="glass-card p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gemini-text-primary mb-6">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gemini-text-secondary text-sm font-medium mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gemini-bg border border-gemini-indigo/30 rounded-lg text-gemini-text-primary placeholder-gemini-text-muted focus:outline-none focus:ring-2 focus:ring-gemini-neon focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gemini-text-secondary text-sm font-medium mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-4 py-3 bg-gemini-bg border border-gemini-indigo/30 rounded-lg text-gemini-text-primary placeholder-gemini-text-muted focus:outline-none focus:ring-2 focus:ring-gemini-neon focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gemini-text-secondary text-sm font-medium mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gemini-bg border border-gemini-indigo/30 rounded-lg text-gemini-text-primary focus:outline-none focus:ring-2 focus:ring-gemini-neon focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Health">Health</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gemini-text-secondary text-sm font-medium mb-2">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-3 bg-gemini-bg border border-gemini-indigo/30 rounded-lg text-gemini-text-primary placeholder-gemini-text-muted focus:outline-none focus:ring-2 focus:ring-gemini-neon focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gemini-text-secondary text-sm font-medium mb-2">
                      Stock
                    </label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-3 bg-gemini-bg border border-gemini-indigo/30 rounded-lg text-gemini-text-primary placeholder-gemini-text-muted focus:outline-none focus:ring-2 focus:ring-gemini-neon focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 bg-gemini-surface text-gemini-text-secondary rounded-lg hover:bg-gemini-card transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 neon-button"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Products;
