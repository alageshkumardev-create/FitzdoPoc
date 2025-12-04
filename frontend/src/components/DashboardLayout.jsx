import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import useAuth from '../hooks/useAuth';
import SearchBar from './SearchBar';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, signout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/products?q=${encodeURIComponent(query)}`);
    } else if (window.location.pathname === '/products') {
      // Only clear if we are on products page, otherwise don't navigate
      navigate('/products');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 py-3 gap-4">
            {/* Left Section: Mobile Toggle & Logo */}
            <div className="flex items-center gap-3 lg:hidden shrink-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="bg-orange-500 text-white px-2 py-1 rounded font-bold text-sm">
                FITZDO
              </div>
            </div>

            {/* Right Section: Search + Profile */}
            <div className="flex items-center justify-end gap-4 flex-1">
              <div className="w-full max-w-md">
                <SearchBar
                  value={searchParams.get('q') || ''}
                  onChange={handleSearch}
                  placeholder="Search for products..."
                />
              </div>

              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 focus:outline-none"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">Super-Admin</p>
                  </div>
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`}
                    alt={user?.name || 'User'}
                    className="w-9 h-9 rounded-full border border-gray-200 hover:ring-2 hover:ring-orange-500 transition-all"
                  />
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20 border border-gray-100">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@fitzdo.com'}</p>
                        <p className="text-xs text-orange-600 mt-1 font-medium">Super-Admin</p>
                      </div>

                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          // Add navigation to profile page if exists, for now just close
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        My Profile
                      </button>

                      <button
                        onClick={signout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
