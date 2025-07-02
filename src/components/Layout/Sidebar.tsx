
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/pos', label: 'POS', icon: '🛒' },
    { path: '/products', label: 'Products', icon: '📦' },
    { path: '/sales', label: 'Sales', icon: '💰' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-gemini-surface h-screen flex flex-col border-r border-gemini-indigo/20">
      {/* Logo Area */}
      <div className="p-6 border-b border-gemini-indigo/20">
        <h1 className="text-2xl font-bold text-gemini-neon">ShopPOS</h1>
        <p className="text-gemini-text-muted text-sm mt-1">Point of Sale System</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gemini-indigo/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gemini-indigo rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-white">
              {user?.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-gemini-text-primary font-medium">{user?.username}</p>
            <p className="text-gemini-text-muted text-xs capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className={`sidebar-item w-full ${
                  location.pathname === item.path ? 'active' : ''
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gemini-indigo/20">
        <button
          onClick={handleLogout}
          className="sidebar-item w-full text-red-400 hover:bg-red-500/20 hover:text-red-300"
        >
          <span className="text-xl">🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
