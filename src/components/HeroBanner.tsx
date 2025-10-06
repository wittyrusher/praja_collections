'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function HeroBanner() {
  return (
    <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-violet-800 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-image.jpg"
          alt="Hero Background"
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
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
              className="bg-emerald-950 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition inline-flex items-center justify-center text-white"
            >
              Shop Now
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/products?featured=true"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-800 hover:text-primary-600 transition inline-flex items-center justify-center"
            >
              Featured Products
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Circle with Image - Hidden on mobile, visible on desktop */}
      <div className="hidden md:block absolute bottom-0 right-0 md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] xl:w-[450px] xl:h-[450px] opacity-90">
        <div className="relative w-full h-full rounded-full overflow-hidden">
          <Image
            src="/images/hero-circle.png"
            alt="Decorative"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}