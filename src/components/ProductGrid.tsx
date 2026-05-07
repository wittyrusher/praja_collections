import React from 'react';
import ProductCard from './ProductCard';
import { IProduct } from '../types/product';

interface ProductGridProps {
  products: IProduct[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center mb-4">
          <span className="text-2xl">🛍️</span>
        </div>
        <p className="text-stone-400 font-medium text-base" style={{ fontFamily: 'Georgia, serif' }}>
          No products found
        </p>
        <p className="text-stone-600 text-sm mt-1">Check back soon for new arrivals</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}