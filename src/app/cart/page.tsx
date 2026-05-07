'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';
import Button from '../../components/ui/Button';

export default function CartPage() {
  const { cart, clearCart } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-md mx-auto text-center">
            <div className="w-28 h-28 mx-auto mb-8 rounded-full bg-stone-100 border-2 border-stone-200 flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-stone-400" strokeWidth={1.5} />
            </div>
            <h2
              className="text-4xl font-bold text-stone-900 mb-3 tracking-tight"
              style={{ fontFamily: "'Georgia', serif", letterSpacing: '-0.02em' }}
            >
              Your cart is empty
            </h2>
            <p className="text-stone-600 text-lg mb-10 leading-relaxed">
              Looks like you haven't added anything yet. Browse our collection and find something you love.
            </p>
            <Link href="/products">
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-stone-900 text-white text-base font-semibold rounded-full hover:bg-stone-700 transition-colors duration-200 shadow-md">
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-stone-50"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Header Bar */}
      <div className="bg-stone-900 text-white px-6 py-5">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-amber-400" strokeWidth={1.5} />
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ fontFamily: "'Georgia', serif", letterSpacing: '-0.02em' }}
            >
              Shopping Cart
            </h1>
            <span className="ml-1 bg-amber-400 text-stone-900 text-sm font-bold px-2.5 py-0.5 rounded-full">
              {cart.totalItems}
            </span>
          </div>
          <button
            onClick={clearCart}
            className="flex items-center gap-2 text-stone-300 hover:text-red-400 transition-colors duration-150 text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cart
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
                <h2
                  className="text-lg font-bold text-stone-900"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  Items in your cart
                </h2>
                <span className="text-stone-500 text-sm font-medium">
                  {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="divide-y divide-stone-100">
                {cart.items.map((item) => (
                  <div key={item.productId} className="px-6 py-4">
                    <CartItem item={item} />
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Shopping */}
            <div className="pt-2">
              <Link href="/products">
                <button className="inline-flex items-center gap-2 px-6 py-3 border-2 border-stone-900 text-stone-900 font-semibold text-sm rounded-full hover:bg-stone-900 hover:text-white transition-colors duration-200">
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1 sticky top-8">
            <div className="bg-stone-900 text-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-stone-700">
                <h2
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  Order Summary
                </h2>
              </div>
              <div className="px-6 py-5">
                <CartSummary />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}