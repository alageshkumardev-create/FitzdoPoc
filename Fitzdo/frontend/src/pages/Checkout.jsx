import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import useCart from '../hooks/useCart';
import { formatPrice } from '../utils/format';
import { bankOffers, cashbackOffers, paymentMethods, deliveryCharges, TAX_RATE } from '../data/offersData';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, getCartTotal, getCartSavings, updateQuantity, removeFromCart, clearCart } = useCart();

  const [step, setStep] = useState(1); // 1: Cart, 2: Address, 3: Payment
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [selectedPaymentOption, setSelectedPaymentOption] = useState('');
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Address form
  const [address, setAddress] = useState({
    fullName: '',
    mobile: '',
    pincode: '',
    flatNo: '',
    area: '',
    landmark: '',
    city: '',
    state: ''
  });

  // Calculations
  const subtotal = getCartTotal();
  const savings = getCartSavings();
  const deliveryFee = subtotal >= deliveryCharges.free.threshold ? 0 : deliveryCharges.standard.charge;
  const taxableAmount = subtotal + deliveryFee;
  const tax = taxableAmount * TAX_RATE;

  // Apply selected offer
  let offerDiscount = 0;
  if (selectedOffer) {
    const offer = bankOffers.find(o => o.id === selectedOffer);
    if (offer && subtotal >= offer.minPurchase) {
      offerDiscount = Math.min(offer.discount, subtotal * 0.5); // Max 50% discount
    }
  }

  // Apply cashback (for display only)
  const cashback = selectedPaymentMethod === 'upi' || selectedPaymentMethod === 'card'
    ? Math.min(subtotal * 0.05, 500)
    : 0;

  const finalTotal = Math.round(subtotal + deliveryFee + tax - offerDiscount);

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handlePlaceOrder = () => {
    if (!selectedPaymentMethod || (selectedPaymentMethod !== 'cod' && !selectedPaymentOption)) {
      alert('Please select a payment method');
      return;
    }

    // Simulate order placement
    setOrderPlaced(true);
    setTimeout(() => {
      clearCart();
      navigate('/products');
    }, 3000);
  };

  if (cart.length === 0 && !orderPlaced) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (orderPlaced) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center bg-white p-12 rounded-lg shadow-lg max-w-md">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-4">Thank you for your order. You will be redirected shortly...</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-green-800">
                <strong>Payment Method:</strong> {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
              </p>
              <p className="text-sm text-green-800">
                <strong>Total Amount:</strong> {formatPrice(finalTotal)}
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header Progress */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold text-gray-900">Checkout</h1>
              <button
                onClick={() => navigate('/products')}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Continue Shopping
              </button>
            </div>
            {/* Progress Steps */}
            <div className="flex items-center gap-4">
              <div className={`flex-1 h-2 rounded ${step >= 1 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
              <div className={`flex-1 h-2 rounded ${step >= 2 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
              <div className={`flex-1 h-2 rounded ${step >= 3 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs font-medium">
              <span className={step >= 1 ? 'text-orange-600' : 'text-gray-500'}>Cart</span>
              <span className={step >= 2 ? 'text-orange-600' : 'text-gray-500'}>Address</span>
              <span className={step >= 3 ? 'text-orange-600' : 'text-gray-500'}>Payment</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* STEP 1: Cart Items */}
              {step === 1 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Shopping Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
                  </h2>
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={`${item.product._id}-${item.size}`} className="flex gap-4 pb-4 border-b last:border-b-0">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.title}
                          className="w-24 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">{item.product.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">Size: {item.size}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center border border-gray-300 rounded">
                              <button
                                onClick={() => updateQuantity(item.product._id, item.size, item.quantity - 1)}
                                className="px-3 py-1 hover:bg-gray-100"
                              >
                                −
                              </button>
                              <span className="px-3 py-1 font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product._id, item.size, item.quantity + 1)}
                                className="px-3 py-1 hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product._id, item.size)}
                              className="text-sm text-red-600 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                          {item.product.mrp > item.product.price && (
                            <p className="text-sm text-gray-500 line-through">
                              {formatPrice(item.product.mrp * item.quantity)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    className="w-full mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Proceed to Address
                  </button>
                </div>
              )}

              {/* STEP 2: Address Form */}
              {step === 2 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Delivery Address</h2>
                    <button onClick={() => setStep(1)} className="text-sm text-gray-600 hover:text-gray-900">
                      Back to Cart
                    </button>
                  </div>
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Full Name *"
                        value={address.fullName}
                        onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Mobile Number *"
                        value={address.mobile}
                        onChange={(e) => setAddress({ ...address, mobile: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Pincode *"
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Flat, House No., Building, Company, Apartment *"
                      value={address.flatNo}
                      onChange={(e) => setAddress({ ...address, flatNo: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Area, Colony, Street, Sector, Village *"
                      value={address.area}
                      onChange={(e) => setAddress({ ...address, area: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Landmark (Optional)"
                      value={address.landmark}
                      onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Town/City *"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                      <input
                        type="text"
                        placeholder="State *"
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
                    >
                      Proceed to Payment
                    </button>
                  </form>
                </div>
              )}

              {/* STEP 3: Payment Options */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                      <button onClick={() => setStep(2)} className="text-sm text-gray-600 hover:text-gray-900">
                        Back to Address
                      </button>
                    </div>

                    {/* Payment Methods */}
                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="border border-gray-300 rounded-lg overflow-hidden">
                          <button
                            onClick={() => {
                              setSelectedPaymentMethod(method.id);
                              if (method.options.length === 0) {
                                setSelectedPaymentOption('');
                              }
                            }}
                            className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${selectedPaymentMethod === method.id ? 'bg-orange-50 border-l-4 border-orange-500' : ''
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{method.icon}</span>
                              <span className="font-medium text-gray-900">{method.name}</span>
                            </div>
                            <span className="text-gray-500">
                              {selectedPaymentMethod === method.id ? '▼' : '▶'}
                            </span>
                          </button>

                          {/* Payment Options */}
                          {selectedPaymentMethod === method.id && method.options.length > 0 && (
                            <div className="border-t border-gray-200 bg-gray-50 p-4">
                              <div className="grid grid-cols-1 gap-2">
                                {method.options.map((option) => (
                                  <label
                                    key={option.id}
                                    className="flex items-center gap-3 p-3 border border-gray-300 rounded bg-white hover:border-orange-500 cursor-pointer transition-colors"
                                  >
                                    <input
                                      type="radio"
                                      name="payment-option"
                                      value={option.id}
                                      checked={selectedPaymentOption === option.id}
                                      onChange={(e) => setSelectedPaymentOption(e.target.value)}
                                      className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                                    />
                                    <span className="text-lg">{option.logo}</span>
                                    <span className="text-sm font-medium text-gray-900">{option.name}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handlePlaceOrder}
                      disabled={!selectedPaymentMethod || (selectedPaymentMethod !== 'cod' && !selectedPaymentOption)}
                      className="w-full mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-4 pb-4 border-b">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({cart.length} items)</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Savings</span>
                      <span>- {formatPrice(savings)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">
                      {deliveryFee === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        formatPrice(deliveryFee)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">GST (18%)</span>
                    <span className="font-medium">{formatPrice(tax)}</span>
                  </div>
                  {offerDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Offer Discount</span>
                      <span>- {formatPrice(offerDiscount)}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between text-lg font-semibold text-gray-900 mb-4 pb-4 border-b">
                  <span>Total Amount</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>

                {/* Cashback Info */}
                {cashback > 0 && step === 3 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-green-800">
                      <span className="text-lg">💰</span>
                      <span><strong>Cashback:</strong> You'll receive {formatPrice(cashback)} cashback after order delivery</span>
                    </div>
                  </div>
                )}

                {/* Bank Offers */}
                {step >= 1 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Available Offers</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {bankOffers.slice(0, 3).map((offer) => (
                        <div
                          key={offer.id}
                          onClick={() => setSelectedOffer(selectedOffer === offer.id ? null : offer.id)}
                          className={`border rounded-lg p-3 cursor-pointer transition-colors ${selectedOffer === offer.id
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-300 hover:border-orange-500'
                            }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-lg">{offer.icon}</span>
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-gray-900">{offer.title}</p>
                              <p className="text-xs text-gray-600 mt-1">{offer.description}</p>
                              <p className="text-xs text-blue-600 mt-1">Code: {offer.code}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
