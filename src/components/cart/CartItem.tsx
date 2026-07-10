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
    <div className="group grid items-center gap-4 px-5 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors duration-150"
      style={{ gridTemplateColumns: '72px 1fr auto auto auto' }}>

      {/* Product Image */}
      <div className="relative w-[72px] h-[72px] flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
        <Image
          src={item.image || '/placeholder-product.jpg'}
          alt={item.name || 'Product image'}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 truncate">
          {item.name}
        </h3>
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          {item.size && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
              {item.size}
            </span>
          )}
          {item.color && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
              {item.color}
            </span>
          )}
        </div>
        <p className="text-sm font-semibold text-gray-900 mt-1.5">
          {formatCurrency(item.price)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
          aria-label="Decrease quantity"
          className="w-8 h-8 flex items-center justify-center text-black hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-8 bg-gray-200" />
        <span className="w-9 text-center text-sm font-semibold text-gray-900">
          {item.quantity}
        </span>
        <div className="w-px h-8 bg-gray-200" />
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={item.quantity >= item.stock}
          aria-label="Increase quantity"
          className="w-8 h-8 flex items-center justify-center text-black hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Line Total */}
      <div className="w-20 text-right">
        <p className="text-sm font-semibold text-gray-900">
          {formatCurrency(item.price * item.quantity)}
        </p>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeFromCart(item.productId)}
        aria-label="Remove item"
        className="w-8 h-8 flex items-center justify-center rounded-lg text-black hover:text-red-600 hover:bg-red-50 transition-colors duration-150"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}