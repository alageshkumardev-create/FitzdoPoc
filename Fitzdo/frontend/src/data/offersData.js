// Bank offers and cashback data
export const bankOffers = [
  {
    id: 'offer-1',
    bank: 'ICICI Bank',
    type: 'Credit Card',
    title: 'Flat ₹2500 Off on ₹7500+ Purchase',
    description: 'Get instant discount using ICICI Bank Credit Cards on minimum purchase of ₹7500',
    code: 'ICICI2500',
    discount: 2500,
    minPurchase: 7500,
    icon: '🏦',
    color: 'red'
  },
  {
    id: 'offer-2',
    bank: 'HDFC Bank',
    type: 'Debit & Credit Card',
    title: '10% Cashback up to ₹1500',
    description: 'Use HDFC Bank Cards and get 10% instant cashback up to ₹1500',
    code: 'HDFC10',
    discount: 1500,
    minPurchase: 3000,
    icon: '💳',
    color: 'blue'
  },
  {
    id: 'offer-3',
    bank: 'SBI',
    type: 'Credit Card',
    title: '₹1000 Off on ₹5000+',
    description: 'SBI Credit Card holders get ₹1000 instant discount on minimum purchase of ₹5000',
    code: 'SBI1000',
    discount: 1000,
    minPurchase: 5000,
    icon: '🏧',
    color: 'green'
  },
  {
    id: 'offer-4',
    bank: 'Axis Bank',
    type: 'Credit Card',
    title: '15% Cashback up to ₹2000',
    description: 'Exclusive offer for Axis Bank Credit Card users - Get 15% cashback',
    code: 'AXIS15',
    discount: 2000,
    minPurchase: 4000,
    icon: '💰',
    color: 'purple'
  },
  {
    id: 'offer-5',
    bank: 'Paytm',
    type: 'UPI',
    title: '₹100 Cashback on UPI',
    description: 'Pay via Paytm UPI and get assured cashback of ₹100',
    code: 'PAYTM100',
    discount: 100,
    minPurchase: 500,
    icon: '📱',
    color: 'cyan'
  },
  {
    id: 'offer-6',
    bank: 'PhonePe',
    type: 'UPI',
    title: 'Flat ₹150 Off on PhonePe',
    description: 'Use PhonePe for payment and get instant discount of ₹150',
    code: 'PHONEPE150',
    discount: 150,
    minPurchase: 1000,
    icon: '📲',
    color: 'indigo'
  }
];

// Cashback offers
export const cashbackOffers = [
  {
    id: 'cashback-1',
    title: 'Extra 5% Cashback on Prepaid Orders',
    description: 'Pay online and get additional 5% cashback in your wallet',
    percentage: 5,
    maxCashback: 500,
    icon: '💵'
  },
  {
    id: 'cashback-2',
    title: 'FITZDO Coins Reward',
    description: 'Earn 2% of order value as FITZDO coins for future purchases',
    percentage: 2,
    maxCashback: 1000,
    icon: '🪙'
  },
  {
    id: 'cashback-3',
    title: 'First Order Bonus',
    description: 'Get ₹200 bonus cashback on your first order above ₹2000',
    discount: 200,
    minPurchase: 2000,
    icon: '🎁'
  }
];

// Delivery charges calculation
export const deliveryCharges = {
  free: {
    threshold: 1000,
    charge: 0
  },
  standard: {
    charge: 80
  },
  express: {
    charge: 150
  }
};

// Tax rate
export const TAX_RATE = 0.18; // 18% GST

// Payment methods
export const paymentMethods = [
  {
    id: 'upi',
    name: 'UPI',
    icon: '📱',
    options: [
      { id: 'paytm', name: 'Paytm UPI', logo: '📱' },
      { id: 'phonepe', name: 'PhonePe', logo: '📲' },
      { id: 'gpay', name: 'Google Pay', logo: '💳' },
      { id: 'bhim', name: 'BHIM UPI', logo: '🏦' }
    ]
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    icon: '🏦',
    options: [
      { id: 'sbi', name: 'State Bank of India', logo: '🏦' },
      { id: 'hdfc', name: 'HDFC Bank', logo: '🏦' },
      { id: 'icici', name: 'ICICI Bank', logo: '🏦' },
      { id: 'axis', name: 'Axis Bank', logo: '🏦' },
      { id: 'kotak', name: 'Kotak Mahindra Bank', logo: '🏦' }
    ]
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: '💳',
    options: [
      { id: 'visa', name: 'Visa', logo: '💳' },
      { id: 'mastercard', name: 'Mastercard', logo: '💳' },
      { id: 'rupay', name: 'RuPay', logo: '💳' },
      { id: 'amex', name: 'American Express', logo: '💳' }
    ]
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    icon: '💵',
    options: []
  },
  {
    id: 'wallet',
    name: 'Wallets',
    icon: '👛',
    options: [
      { id: 'paytm-wallet', name: 'Paytm Wallet', logo: '👛' },
      { id: 'mobikwik', name: 'MobiKwik', logo: '👛' },
      { id: 'freecharge', name: 'FreeCharge', logo: '👛' },
      { id: 'amazonpay', name: 'Amazon Pay', logo: '👛' }
    ]
  }
];
