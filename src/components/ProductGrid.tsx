import React from 'react';
import ProductCard from './ProductCard';
import { IProduct } from '../types/product';
import { ShoppingBag } from 'lucide-react';

interface ProductGridProps {
  products: IProduct[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-24 text-center"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        <div className="w-20 h-20 rounded-full bg-stone-100 border-2 border-stone-200 flex items-center justify-center mb-5">
          <ShoppingBag className="w-8 h-8 text-stone-400" strokeWidth={1.5} />
        </div>
        <h3 className="text-stone-900 font-bold text-xl mb-2">No products found</h3>
        <p className="text-stone-500 text-sm max-w-xs leading-relaxed">
          Try adjusting your filters or selecting a different category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}