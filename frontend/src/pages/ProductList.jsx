import React, { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { mockProductService } from '../services/mockService';
import DashboardLayout from '../components/DashboardLayout';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import SkeletonCard from '../components/SkeletonCard';
import FilterPanel from '../components/FilterPanel';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filters and pagination
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
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
        {/* Filter Drawer Overlay */}
        {showFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setShowFilters(false)} />
        )}

        {/* Filter Drawer */}
        <div className={`fixed inset-y-0 right-0 z-40 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${showFilters ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-full overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FilterPanel filters={filters} onFilterChange={setFilters} />
          </div>
        </div>

        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 lg:static lg:z-auto">
          <div className="px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Product List</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Results for "Fitness & Training" • {totalResults} Results
                </p>
              </div>

              <div className="flex items-center gap-2 self-end lg:self-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 bg-white text-sm"
                >
                  <option value="-createdAt">Most Recent</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-rating">Highest Rated</option>
                  <option value="-discountPercent">Most Discount</option>
                </select>

                <button
                  onClick={() => setShowFilters(true)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Product Grid - Full Width */}
            <div className="flex-1">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {loading ? (
                      Array.from({ length: 12 }).map((_, i) => (
                        <SkeletonCard key={i} />
                      ))
                    ) : products.length === 0 ? (
                      <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                        <div className="text-4xl mb-3">🔍</div>
                        <p className="text-gray-600 font-medium">No products found matching your criteria.</p>
                        <button
                          onClick={() => setFilters({
                            categories: [],
                            minPrice: 0,
                            maxPrice: 999999,
                            minRating: 0,
                            sponsored: false
                          })}
                          className="mt-4 text-orange-600 hover:text-orange-700 font-medium"
                        >
                          Clear all filters
                        </button>
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
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
