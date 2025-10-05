'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart } from 'lucide-react';
import { IProduct } from '../types/product';
import { formatCurrency, calculateDiscount } from '../utils/helpers';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }

    addToCart({
      productId: product._id,
      name: product.name,
      price: product.discountPrice || product.price,
      quantity: 1,
      image: product.images[0],
      stock: product.stock,
    });
  };

  const discount = product.discountPrice
    ? calculateDiscount(product.price, product.discountPrice)
    : 0;

  return (
    <Link href={`/products/${product._id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
              {discount}% OFF
            </div>
          )}

          {/* Stock Badge */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-white text-gray-900 px-4 py-2 rounded-md font-semibold">
                Out of Stock
              </span>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast.success('Added to wishlist');
            }}
          >
            <Heart className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <p className="text-sm text-gray-500 mb-1">{product.category}</p>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-xl font-bold text-gray-900">
              {formatCurrency(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}