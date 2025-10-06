'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CATEGORIES } from '../utils/constants';

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (slug === 'all') {
      params.delete('category');
    } else {
      params.set('category', slug);
    }

    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-md">
      <h3 className="font-semibold text-lg mb-4">Categories</h3>
      <div className="space-y-2">
        <button
          onClick={() => handleCategoryChange('all')}
          className={`w-full text-left px-4 py-2 rounded-lg transition ${
            !currentCategory
              ? 'bg-primary-600 text-white'
              : 'hover:bg-black'
          }`}
        >
          All Products
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category.slug}
            onClick={() => handleCategoryChange(category.slug)}
            className={`w-full text-left px-4 py-2 rounded-lg transition ${
              currentCategory === category.slug
                ? 'bg-primary-600 text-white'
                : 'hover:bg-black'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}