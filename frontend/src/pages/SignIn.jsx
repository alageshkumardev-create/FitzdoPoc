import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);

    const result = await signin(email, password);

    setLoading(false);

    if (result.success) {
      navigate('/products');
    } else {
      setError(result.error || 'Sign in failed');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FITZDO</h1>
              <p className="text-xs text-gray-600">& BUSINESS</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🇮🇳</span>
                <span className="text-sm font-medium">IN</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🌐</span>
                <span className="text-sm font-medium">EN</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>Fitzdo is Secure</span>
                <span className="text-lg">🔒</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full">
          {/* Logo */}
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-2">
              <span className="text-gray-900">FITZDO</span>
              <span className="text-gray-900 ml-2">|</span>
              <span className="italic font-serif ml-2">Circle</span>
            </h2>
          </div>

          {/* Login Form */}
          <div className="bg-white">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">Login to your Account</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-normal text-gray-700 mb-2">
                  Email - ID <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                  placeholder="Enter Your Email - ID"
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-normal text-gray-700 mb-2">
                  Enter Your Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                    placeholder="Enter Your Password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-auto px-8 py-2.5 bg-black hover:bg-gray-800 text-white font-medium rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>

            <div className="mt-6">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
