'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { IProduct } from '../types/product';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface WishlistContextType {
  wishlistItems: IProduct[];
  toggleWishlist: (product: IProduct) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWishlist = async () => {
    if (status !== 'authenticated') {
      setWishlistItems([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/users/wishlist');
      const data = await res.json();
      if (data.success) {
        setWishlistItems(data.wishlist || []);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [status]);

  const toggleWishlist = async (product: IProduct) => {
    if (status !== 'authenticated') {
      toast.error('Please log in to add items to your wishlist');
      router.push(`/login?redirect=${window.location.pathname}${window.location.search}`);
      return;
    }

    // Optimistic UI update
    const exists = wishlistItems.some((item) => item._id === product._id);
    if (exists) {
      setWishlistItems((prev) => prev.filter((item) => item._id !== product._id));
      toast.success('Removed from wishlist');
    } else {
      setWishlistItems((prev) => [...prev, product]);
      toast.success('Added to wishlist');
    }

    try {
      const res = await fetch('/api/users/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error('Failed to update wishlist on server');
        fetchWishlist();
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      fetchWishlist();
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  const value = {
    wishlistItems,
    toggleWishlist,
    isInWishlist,
    isLoading,
    fetchWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
