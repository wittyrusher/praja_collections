'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Truck, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/helpers';
import { useSession } from 'next-auth/react';

export default function CartSummary() {
  const { cart } = useCart();
  const router = useRouter();
  const { data: session } = useSession();

  const subtotal = cart.totalPrice;
  const shipping = subtotal > 999 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;
  const freeShippingLeft = 999 - subtotal;
  const shippingProgress = Math.min((subtotal / 999) * 100, 100);

  const handleCheckout = () => {
    if (!session) {
      router.push('/login?redirect=/checkout');
      return;
    }
    router.push('/checkout');
  };

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      {/* Free Shipping Progress */}
      {subtotal < 999 && (
        <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <p className="text-sm font-semibold text-amber-800">
              Add <span className="font-bold">{formatCurrency(freeShippingLeft)}</span> more for FREE shipping!
            </p>
          </div>
          <div className="w-full bg-amber-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${shippingProgress}%` }}
            />
          </div>
        </div>
      )}
      {subtotal >= 999 && (
        <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
          <Truck className="w-4 h-4 text-green-600 flex-shrink-0" />
          <p className="text-sm font-semibold text-green-800">You've unlocked FREE shipping! 🎉</p>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-3 mb-5">
        <div className="flex justify-between items-center">
          <span className="text-stone-200 text-sm font-medium">
            Subtotal ({cart.totalItems} item{cart.totalItems !== 1 ? 's' : ''})
          </span>
          <span className="font-bold text-white text-sm">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-stone-200 text-sm font-medium">Shipping</span>
          {shipping === 0 ? (
            <span className="font-bold text-green-400 text-sm">FREE</span>
          ) : (
            <span className="font-bold text-white text-sm">{formatCurrency(shipping)}</span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-stone-200 text-sm font-medium flex items-center gap-1">
            <Tag className="w-3 h-3" />
            GST (18%)
          </span>
          <span className="font-bold text-white text-sm">{formatCurrency(tax)}</span>
        </div>

        <div className="border-t-2 border-dashed border-stone-500 pt-3 flex justify-between items-center">
          <span className="font-bold text-white text-base">Total</span>
          <span className="font-bold text-amber-400 text-xl">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={cart.items.length === 0}
        className="w-full py-4 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-300 disabled:cursor-not-allowed text-stone-900 font-bold text-base rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg active:scale-[0.98] transition-transform"
        style={{ fontFamily: "'Georgia', serif", letterSpacing: '-0.01em' }}
      >
        Proceed to Checkout →
      </button>

      {/* Trust Badges */}
      <div className="mt-4 flex items-center justify-center gap-4 text-stone-300">
        <div className="flex items-center gap-1 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          Secure Checkout
        </div>
        <span className="text-stone-300">•</span>
        <div className="flex items-center gap-1 text-xs font-medium">
          Safe Payments
        </div>
      </div>
    </div>
  );
}