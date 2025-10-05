'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function HeroBanner() {
  return (
    <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Discover Your Style with Praja Collections
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-100">
            Shop the latest trends in fashion. Quality products, amazing prices, and
            fast delivery right to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/products"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-flex items-center justify-center"
            >
              Shop Now
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/products?featured=true"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition inline-flex items-center justify-center"
            >
              Featured Products
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 opacity-10">
        <svg
          width="400"
          height="400"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="200" cy="200" r="200" fill="white" />
        </svg>
      </div>
    </div>
  );
}