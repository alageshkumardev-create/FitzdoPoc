import React, { useMemo } from 'react';
import { formatPrice, formatRating, formatNumber } from '../utils/format';

export default function ProductCard({ product }) {
  // Compute values with useMemo
  const discountBadge = useMemo(() => {
    if (product.discountPercent > 0) {
      return (
        <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
          {product.discountPercent}% OFF
        </span>
      );
    }
    return null;
  }, [product.discountPercent]);

  const ratingStars = useMemo(() => {
    const rating = product.rating;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <span key={i} className="text-yellow-400">★</span>;
          } else if (i === fullStars && hasHalfStar) {
            return <span key={i} className="text-yellow-400">★</span>;
          } else {
            return <span key={i} className="text-gray-300">★</span>;
          }
        })}
      </div>
    );
  }, [product.rating]);

  const isSponsored = useMemo(() => {
    return product.tags?.includes('Fitzdo Sponsored');
  }, [product.tags]);

  return (
    <div className="card hover:shadow-md transition-shadow duration-200 cursor-pointer">
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        {isSponsored && (
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded">
            Fitzdo Sponsored
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-600 mb-1">{product.brand}</p>
        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 h-10">
          {product.title}
        </h3>

        <div className="flex items-center gap-2 mb-2">
          {ratingStars}
          <span className="text-sm text-gray-600">
            {formatRating(product.rating)} ({formatNumber(product.ratingCount)})
          </span>
          {discountBadge}
        </div>



        <p className="text-xs text-green-700 font-medium">
          {product.deliveryInfo}
        </p>
        <hr className='mt-1' />
        <div className="flex items-baseline gap-2 mt-1 mb-2">
          <span className="text-lg font-semibold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.mrp > product.price && (
            <>
              <span className="text-sm text-gray-500"> M.R.P:<span className="text-sm text-gray-500 line-through">
                {formatPrice(product.mrp)}
              </span></span>

            </>
          )}
        </div>
      </div>
    </div>
  );
}
