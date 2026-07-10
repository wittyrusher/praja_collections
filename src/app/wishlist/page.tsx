'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import Loading from '../../components/ui/Loading';
import Button from '../../components/ui/Button';
import ProductCard from '../../components/ProductCard';
import { useWishlist } from '../../context/WishlistContext';

export default function WishlistPage() {
  const { status } = useSession();
  const router = useRouter();
  const { wishlistItems, isLoading } = useWishlist();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/wishlist');
    }
  }, [status, router]);

  if (status === 'loading' || isLoading) {
    return <Loading text="Loading your wishlist..." />;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div
      className="min-h-screen bg-stone-50 py-12"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8 border-b border-stone-200 pb-5 flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          <div>
            <h1 className="text-3xl font-bold text-stone-900 tracking-tight">My Wishlist</h1>
            <p className="text-black text-sm mt-1">Products you have saved for later</p>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-16 text-center border border-stone-200/60 max-w-xl mx-auto mt-10">
            <div className="w-16 h-16 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-stone-300" />
            </div>
            <h3 className="text-stone-950 font-bold text-xl mb-2">Your wishlist is empty</h3>
            <p className="text-black text-sm mb-6 leading-relaxed">
              Explore our collections and tap the heart icon on any product to save it here.
            </p>
            <Link href="/products">
              <Button className="bg-stone-900 hover:bg-stone-800 text-white font-semibold">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
