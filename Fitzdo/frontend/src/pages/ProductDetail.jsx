import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { mockProductService } from '../services/mockService';
import DashboardLayout from '../components/DashboardLayout';
import useCart from '../hooks/useCart';
import { formatPrice, formatRating } from '../utils/format';
import { bankOffers, cashbackOffers } from '../data/offersData';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('whatsInBox');
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const result = await mockProductService.getProductById(id);

        if (result.success) {
          setProduct(result.data);
        } else {
          setError(result.error || 'Failed to fetch product');
        }
      } catch (err) {
        console.error('Fetch product error:', err);
        setError(err.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !product) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              Back to Products
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Top Bar with Breadcrumb */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-2">
              <Link
                to="/products"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Products
              </Link>
            </div>
            <div className="text-sm text-gray-600">
              <Link to="/products" className="hover:text-gray-900">Store</Link>
              {' > '}
              <span>Fitzdo & Sports</span>
              {' > '}
              <span>Exercise & Fitness</span>
              {' > '}
              <span>Cardio & Yoga</span>
              {' > '}
              <span className="text-gray-900 font-medium">{product.category}</span>
            </div>
          </div>
        </header>

        {/* Product Detail Content */}
        <main className="p-6">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Left Column - Product Images */}
              <div>
                <div className="relative mb-4 bg-gray-50 rounded-lg p-6">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-96 object-contain rounded-lg"
                  />
                  {product.tags?.includes('Fitzdo Sponsored') && (
                    <span className="absolute top-8 left-8 bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded">
                      Fitzdo Sponsored
                    </span>
                  )}
                </div>
                {/* Thumbnail gallery placeholder */}
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded border-2 border-gray-200 hover:border-orange-500 cursor-pointer transition-colors"></div>
                  ))}
                </div>
              </div>

              {/* Right Column - Product Info */}
              <div>
                <div className="mb-4">
                  <h2 className="text-sm font-semibold text-orange-600 mb-1">{product.brand}</h2>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {product.title}
                  </h1>

                  {/* Rating */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xl ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {formatRating(product.rating)} ({product.ratingCount.toLocaleString()})
                    </span>
                    {product.discountPercent > 0 && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-medium">
                        -{product.discountPercent}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.mrp > product.price && (
                      <span className="text-xl text-gray-500 line-through">
                        M.R.P: {formatPrice(product.mrp)}
                      </span>
                    )}
                  </div>
                  <p className="text-green-700 font-medium text-sm">{product.deliveryInfo}</p>
                </div>

                {/* Bank Offers & Cashback */}
                <div className="mb-6 pb-6 border-b">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Bank Offers & Cashback
                  </h3>
                  <div className="space-y-3">
                    {bankOffers.slice(0, 3).map((offer) => (
                      <div key={offer.id} className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <div className="flex items-start gap-3">
                          <div className="bg-red-500 text-white px-3 py-2 rounded font-bold text-xs">
                            OFFER
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                              {offer.title}
                            </p>
                            <p className="text-xs text-gray-600 mb-1">{offer.description}</p>
                            <p className="text-xs text-blue-600">Code: <strong>{offer.code}</strong></p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {cashbackOffers.slice(0, 1).map((offer) => (
                      <div key={offer.id} className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{offer.icon}</span>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                              {offer.title}
                            </p>
                            <p className="text-xs text-gray-600">{offer.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* QTY and Size */}
                <div className="mb-6 pb-6 border-b">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">QTY</label>
                      <div className="flex items-center border border-gray-300 rounded-lg w-32">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                          −
                        </button>
                        <span className="px-4 py-2 flex-1 text-center font-medium">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                      <div className="flex gap-2 flex-wrap">
                        {['M', 'L', 'XL', 'XXL'].map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`border px-4 py-2 rounded-lg font-medium transition-colors ${selectedSize === size
                              ? 'border-orange-500 bg-orange-50 text-orange-600'
                              : 'border-gray-300 hover:border-gray-900'
                              }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mb-6">
                  {showAddedToCart && (
                    <div className="bg-green-50 border border-green-500 text-green-800 px-4 py-3 rounded-lg flex items-center justify-between">
                      <span className="text-sm font-medium">✅ Added to cart!</span>
                      <button onClick={() => navigate('/checkout')} className="text-sm text-green-700 hover:text-green-900 font-medium underline">Go to Cart</button>
                    </div>
                  )}
                  <button
                    disabled={!product.inStock}
                    onClick={() => {
                      addToCart(product, quantity, selectedSize);
                      setShowAddedToCart(true);
                      setTimeout(() => setShowAddedToCart(false), 5000);
                    }}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                  <button
                    disabled={!product.inStock}
                    onClick={() => {
                      addToCart(product, quantity, selectedSize);
                      navigate('/checkout');
                    }}
                    className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    {product.inStock ? 'Buy Now' : 'Out of Stock'}
                  </button>
                </div>

                {/* Delivery Info */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter the Pin Code to check delivery options
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter Pin Code"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
                      Check
                    </button>
                  </div>
                </div>

                {/* Collapsible Sections */}
                <div className="space-y-2">
                  {/* What's in the Box */}
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setActiveSection(activeSection === 'whatsInBox' ? '' : 'whatsInBox')}
                      className="w-full px-4 py-3 flex items-center justify-between font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      <span>What's in the Box?</span>
                      <span className="text-xl">{activeSection === 'whatsInBox' ? '−' : '+'}</span>
                    </button>
                    {activeSection === 'whatsInBox' && (
                      <div className="px-4 py-3 text-sm text-gray-700 border-t bg-gray-50">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Treadmill x1</li>
                          <li>Tool Kit</li>
                          <li>User Manual</li>
                          <li>Warranty Card</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Product Specification */}
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setActiveSection(activeSection === 'specs' ? '' : 'specs')}
                      className="w-full px-4 py-3 flex items-center justify-between font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      <span>Product Specification</span>
                      <span className="text-xl">{activeSection === 'specs' ? '−' : '+'}</span>
                    </button>
                    {activeSection === 'specs' && (
                      <div className="px-4 py-3 text-sm border-t bg-gray-50">
                        <table className="w-full">
                          <tbody>
                            <tr className="border-b border-gray-200">
                              <td className="py-2 pr-4 text-gray-600 font-medium">Brand</td>
                              <td className="py-2 text-gray-900">{product.brand}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                              <td className="py-2 pr-4 text-gray-600 font-medium">Category</td>
                              <td className="py-2 text-gray-900">{product.category}</td>
                            </tr>
                            <tr>
                              <td className="py-2 pr-4 text-gray-600 font-medium">Status</td>
                              <td className="py-2">
                                <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Additional Information */}
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setActiveSection(activeSection === 'additional' ? '' : 'additional')}
                      className="w-full px-4 py-3 flex items-center justify-between font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      <span>Additional Information</span>
                      <span className="text-xl">{activeSection === 'additional' ? '−' : '+'}</span>
                    </button>
                    {activeSection === 'additional' && (
                      <div className="px-4 py-3 text-sm text-gray-700 border-t bg-gray-50">
                        <p>{product.description || 'No additional information available.'}</p>
                      </div>
                    )}
                  </div>

                  {/* Delivery & Returns */}
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setActiveSection(activeSection === 'delivery' ? '' : 'delivery')}
                      className="w-full px-4 py-3 flex items-center justify-between font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      <span>Delivery & Returns</span>
                      <span className="text-xl">{activeSection === 'delivery' ? '−' : '+'}</span>
                    </button>
                    {activeSection === 'delivery' && (
                      <div className="px-4 py-3 text-sm text-gray-700 border-t bg-gray-50">
                        <p className="mb-2"><strong>Delivery:</strong> {product.deliveryInfo}</p>
                        <p><strong>Returns:</strong> 30-day return policy. Item must be unused and in original packaging.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
