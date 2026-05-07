'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Heart, Bell, Star } from 'lucide-react';
import { IProduct } from '../types/product';
import { formatCurrency, calculateDiscount } from '../utils/helpers';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.discountPrice || product.price,
      quantity: 1,
      image: product.images[0],
      stock: product.stock,
    });
    toast.success('Added to cart');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((v) => !v);
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const discount = product.discountPrice
    ? calculateDiscount(product.price, product.discountPrice)
    : 0;

  return (
    <Link href={`/products/${product._id}`} className="group block">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:border-gray-300 hover:-translate-y-1">

        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {discount > 0 && (
            <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[11px] font-semibold tracking-wide px-2 py-0.5 rounded-md">
              {discount}% OFF
            </span>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
              <span className="bg-white text-gray-900 text-xs font-semibold px-4 py-1.5 rounded-lg">
                Out of stock
              </span>
            </div>
          )}

          <button
            onClick={handleWishlist}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute top-2.5 right-2.5 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center transition hover:bg-gray-50"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${wishlisted ? 'fill-red-500 stroke-red-500' : 'stroke-gray-500'
                }`}
            />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 pt-3.5 pb-4">
          <p className="text-[11px] font-medium tracking-widest uppercase text-gray-400 mb-1">
            {product.category}
          </p>

          <h3 className="font-serif font-light text-[15px] leading-snug text-gray-900 mb-3 line-clamp-2 min-h-[40px]">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-[18px] font-semibold text-gray-900">
              {formatCurrency(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && (
              <span className="text-[13px] text-gray-400 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          {product.stock === 0 ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                toast.success('We&apos;ll notify you when its back!');
              }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-gray-200 text-[13px] font-medium text-gray-400 hover:bg-gray-50 transition"
            >
              <Bell className="w-4 h-4" />
              Notify me
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-gray-200 text-[13px] font-medium text-gray-900 opacity-85 translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to cart
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}