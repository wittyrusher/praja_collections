'use client';

import React from 'react';
import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';
import { ICartItem } from '../../types/cart';
import { formatCurrency } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';

interface CartItemProps {
  item: ICartItem;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > item.stock) return;
    updateQuantity(item.productId, newQuantity);
  };

  return (
    <div className="flex items-center gap-4 py-5 group">
      {/* Product Image */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm">
        <Image
          src={item.image || '/placeholder-product.jpg'}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="flex-grow min-w-0">
        <h3
          className="font-bold text-stone-900 text-base leading-tight truncate"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          {item.name}
        </h3>
        {(item.size || item.color) && (
          <p className="text-stone-500 text-xs mt-1 font-medium tracking-wide uppercase">
            {[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`]
              .filter(Boolean)
              .join('  ·  ')}
          </p>
        )}
        <p className="text-amber-600 font-bold text-sm mt-1.5">
          {formatCurrency(item.price)}
          <span className="text-stone-400 font-normal"> / each</span>
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-1 bg-stone-100 border border-stone-200 rounded-full px-1 py-1">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-stone-900 hover:text-white text-stone-700 transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
          disabled={item.quantity <= 1}
          aria-label="Decrease quantity"
        >
          <Minus className="w-3 h-3" strokeWidth={2.5} />
        </button>
        <span className="w-8 text-center text-sm font-bold text-stone-900 select-none">
          {item.quantity}
        </span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-stone-900 hover:text-white text-stone-700 transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
          disabled={item.quantity >= item.stock}
          aria-label="Increase quantity"
        >
          <Plus className="w-3 h-3" strokeWidth={2.5} />
        </button>
      </div>

      {/* Total Price */}
      <div className="text-right w-20 flex-shrink-0">
        <p className="font-bold text-stone-900 text-base">
          {formatCurrency(item.price * item.quantity)}
        </p>
        {item.quantity > 1 && (
          <p className="text-stone-400 text-xs mt-0.5">
            {item.quantity} × {formatCurrency(item.price)}
          </p>
        )}
      </div>

      {/* Remove Button */}
      <button
        onClick={() => removeFromCart(item.productId)}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-150"
        aria-label="Remove item"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}