import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mockProductService } from '../services/mockService';
import DashboardLayout from '../components/DashboardLayout';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import SkeletonCard from '../components/SkeletonCard';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [filters, setFilters] = useState({
    categories: [],
    minPrice: 0,
    maxPrice: 999999,
    minRating: 0,
    sponsored: false
  });
  const [sortBy, setSortBy] = useState('-createdAt');

  // Fetch products using mock service
  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          q: searchQuery,
          page,
          limit: 12,
          sort: sortBy,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          minRating: filters.minRating,
          sponsored: filters.sponsored ? 'true' : ''
        };

        // Add category filter if any selected
        if (filters.categories && filters.categories.length > 0) {
          params.category = filters.categories[0];
        }

        const result = await mockProductService.getProducts(params);

        if (!cancelled) {
          if (result.success) {
            setProducts(result.data.items);
            setTotalPages(result.data.pagination.pages);
            setTotalResults(result.data.pagination.total);
          } else {
            setError(result.error || 'Failed to fetch products');
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Fetch products error:', err);
          setError(err.message || 'Failed to fetch products');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [searchQuery, page, filters, sortBy]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, filters]);

  // Memoized product cards
  const productCards = useMemo(() => {
    return products.map((product) => (
      <Link key={product._id} to={`/products/${product._id}`}>
        <ProductCard product={product} />
      </Link>
    ));
  }, [products]);

  const handleRetry = () => {
    setError(null);
    setPage(1);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Product List</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Results for "Fitness & Training" • {totalResults} Results
                </p>
              </div>
              <div className="flex items-center gap-4">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white"
                >
                  <option value="-createdAt">Most Recent</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-rating">Highest Rated</option>
                  <option value="-discountPercent">Most Discount</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {loading ? (
                  Array.from({ length: 12 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))
                ) : products.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-600">No products found matching your criteria.</p>
                  </div>
                ) : (
                  productCards
                )}
              </div>

              {/* Pagination */}
              {!loading && products.length > 0 && (
                <div className="flex justify-center">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </DashboardLayout>
  );
}
