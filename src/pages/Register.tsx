import { useAuth } from '@/hooks/useAuth';
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [loading, setLoading] = React.useState(false);
  const { authActions: { register } } = useAuth();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    register({email, password, fullname}, () => {
      setLoading(false);
    });
  };
  // for sign up 
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gemini-bg via-gemini-surface to-gemini-bg">
      <div className="max-w-md w-full">
        {/* Logo Area */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gemini-neon mb-2">ShopPOS</h1>
          <p className="text-gemini-text-secondary">Point of Sale System</p>
        </div>

        {/* Login Form */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-semibold text-gemini-text-primary mb-6 text-center">
            Welcome
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gemini-text-secondary text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full px-4 py-3 bg-gemini-bg border border-gemini-indigo/30 rounded-lg text-gemini-text-primary placeholder-gemini-text-muted focus:outline-none focus:ring-2 focus:ring-gemini-neon focus:border-transparent transition-all duration-200"
                placeholder="Enter your Full Name"
                required
              />
            </div>
            
            <div>
              <label className="block text-gemini-text-secondary text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gemini-bg border border-gemini-indigo/30 rounded-lg text-gemini-text-primary placeholder-gemini-text-muted focus:outline-none focus:ring-2 focus:ring-gemini-neon focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label className="block text-gemini-text-secondary text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gemini-bg border border-gemini-indigo/30 rounded-lg text-gemini-text-primary placeholder-gemini-text-muted focus:outline-none focus:ring-2 focus:ring-gemini-neon focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full neon-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </div>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-gemini-text-secondary text-sm">
              Already have an account?{' '}
              <a
                href={`/login?redirect=${redirectPath}`}
                className="text-gemini-neon hover:underline"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
