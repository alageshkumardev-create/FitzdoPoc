// Formatting utility functions

export const formatPrice = (price) => {
  return `₹${price.toLocaleString('en-IN')}`;
};

export const formatRating = (rating) => {
  return rating.toFixed(1);
};

export const calculateDiscount = (price, mrp) => {
  if (mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
};

export const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};
