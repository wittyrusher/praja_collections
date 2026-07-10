'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CATEGORIES as STATIC_CATEGORIES } from '../utils/constants';

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get('category');
  const newArrivals = searchParams.get('newArrivals') === 'true';
  const sale = searchParams.get('sale') === 'true';
  
  const [categories, setCategories] = useState(STATIC_CATEGORIES);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success && data.categories) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    params.set('page', '1');

    router.push(`/products?${params.toString()}`);
  };

  const handleFilterToggle = (key: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (checked) {
      params.set(key, 'true');
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm sticky top-24 space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-serif font-bold text-stone-900 text-lg mb-4 tracking-tight border-b border-stone-100 pb-3">
          Categories
        </h3>
        <div className="space-y-1.5">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              !currentCategory
                ? 'bg-stone-900 text-white shadow-md'
                : 'text-black hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => handleCategoryChange(category.slug)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 capitalize ${
                currentCategory === category.slug
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'text-black hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Filter By Section */}
      <div className="border-t border-stone-100 pt-6">
        <h3 className="font-serif font-bold text-stone-900 text-lg mb-4 tracking-tight border-b border-stone-100 pb-3">
          Filter By
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-2.5 text-sm font-semibold text-black hover:text-stone-950 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={newArrivals}
              onChange={(e) => handleFilterToggle('newArrivals', e.target.checked)}
              className="h-4 w-4 rounded border-stone-300 text-stone-950 focus:ring-stone-900 cursor-pointer accent-stone-900"
            />
            New Arrivals
          </label>

          <label className="flex items-center gap-2.5 text-sm font-semibold text-black hover:text-stone-950 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={sale}
              onChange={(e) => handleFilterToggle('sale', e.target.checked)}
              className="h-4 w-4 rounded border-stone-300 text-stone-950 focus:ring-stone-900 cursor-pointer accent-stone-900"
            />
            On Sale
          </label>
        </div>
      </div>
    </div>
  );
}