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
    if (newQuantity > item.stock) {
      return;
    }
    updateQuantity(item.productId, newQuantity);
  };

  return (
    <div className="flex items-center space-x-4 py-4 border-b">
      {/* Product Image */}
      <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={item.image || '/placeholder-product.jpg'}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-grow">
        <h3 className="font-semibold text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-500">
          {item.size && `Size: ${item.size}`}
          {item.size && item.color && ' • '}
          {item.color && `Color: ${item.color}`}
        </p>
        <p className="text-primary-600 font-semibold mt-1">
          {formatCurrency(item.price)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="p-1 rounded-md hover:bg-gray-100"
          disabled={item.quantity <= 1}
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center font-semibold">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="p-1 rounded-md hover:bg-gray-100"
          disabled={item.quantity >= item.stock}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Total Price */}
      <div className="text-right w-24">
        <p className="font-bold text-gray-900">
          {formatCurrency(item.price * item.quantity)}
        </p>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => removeFromCart(item.productId)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-md"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}