
import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  ShoppingCartIcon,
  CubeIcon,
  PlayIcon,
  PlusIcon,
  DocumentChartBarIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: "Today's Sales",
      value: '$1,247.80',
      change: '+12.5%',
      icon: CurrencyDollarIcon,
      color: 'text-green-400'
    },
    {
      title: 'Total Revenue',
      value: '$48,392.15',
      change: '+8.2%',
      icon: ChartBarIcon,
      color: 'text-gemini-neon'
    },
    {
      title: 'Transactions',
      value: '127',
      change: '+15.3%',
      icon: ShoppingCartIcon,
      color: 'text-gemini-purple'
    },
    {
      title: 'Products Sold',
      value: '342',
      change: '+9.7%',
      icon: CubeIcon,
      color: 'text-yellow-400'
    }
  ];

  const recentSales = [
    { id: '#001', customer: 'John Doe', amount: '$45.99', time: '2 minutes ago' },
    { id: '#002', customer: 'Jane Smith', amount: '$78.50', time: '5 minutes ago' },
    { id: '#003', customer: 'Mike Johnson', amount: '$123.25', time: '8 minutes ago' },
    { id: '#004', customer: 'Sarah Wilson', amount: '$34.75', time: '12 minutes ago' },
  ];

  const quickActions = [
    { icon: ShoppingCartIcon, title: 'Start Sale', description: 'Open POS', color: 'bg-gemini-indigo/20 hover:bg-gemini-indigo/30' },
    { icon: PlusIcon, title: 'Add Product', description: 'Manage inventory', color: 'bg-gemini-purple/20 hover:bg-gemini-purple/30' },
    { icon: DocumentChartBarIcon, title: 'View Reports', description: 'Sales analytics', color: 'bg-gemini-neon/20 hover:bg-gemini-neon/30' },
    { icon: CogIcon, title: 'Settings', description: 'Configure store', color: 'bg-yellow-500/20 hover:bg-yellow-500/30' }
  ];

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gemini-text-primary mb-2">Dashboard</h1>
          <p className="text-gemini-text-secondary">Welcome back! Here's what's happening in your store today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="glass-card p-6 hover:bg-gemini-card/80 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gemini-text-muted text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-gemini-text-primary mt-1">{stat.value}</p>
                    <p className={`text-sm mt-1 ${stat.color}`}>
                      {stat.change} from yesterday
                    </p>
                  </div>
                  <IconComponent className="w-8 h-8 text-gemini-text-muted" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Sales */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-gemini-text-primary mb-4">Recent Sales</h2>
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 bg-gemini-bg/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gemini-indigo rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {sale.customer.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gemini-text-primary">{sale.customer}</p>
                      <p className="text-sm text-gemini-text-muted">{sale.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gemini-neon">{sale.amount}</p>
                    <p className="text-xs text-gemini-text-muted">{sale.id}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-gemini-text-primary mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <button key={index} className={`p-4 ${action.color} rounded-lg transition-colors duration-200`}>
                    <IconComponent className="w-8 h-8 text-gemini-text-primary mb-2" />
                    <p className="font-medium text-gemini-text-primary">{action.title}</p>
                    <p className="text-xs text-gemini-text-muted">{action.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
