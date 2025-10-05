'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/helpers';
import Button from '../ui/Button';
import { useSession } from 'next-auth/react';

export default function CartSummary() {
  const { cart } = useCart();
  const router = useRouter();
  const { data: session } = useSession();

  const subtotal = cart.totalPrice;
  const shipping = subtotal > 999 ? 0 : 50;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (!session) {
      router.push('/login?redirect=/checkout');
      return;
    }
    router.push('/checkout');
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold">
            {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (GST 18%)</span>
          <span className="font-semibold">{formatCurrency(tax)}</span>
        </div>
        <div className="border-t pt-3 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary-600">{formatCurrency(total)}</span>
        </div>
      </div>

      {subtotal < 999 && (
        <p className="text-sm text-gray-600 mb-4">
          Add {formatCurrency(999 - subtotal)} more for free shipping!
        </p>
      )}

      <Button
        onClick={handleCheckout}
        className="w-full"
        disabled={cart.items.length === 0}
      >
        Proceed to Checkout
      </Button>

      <p className="text-xs text-gray-500 text-center mt-4">
        Secure checkout • Safe payments
      </p>
    </div>
  );
}