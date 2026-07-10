'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingCart, User, Menu, X, Search, LogOut, Package, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { APP_NAME } from '../utils/constants';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { data: session } = useSession();
  const { cart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className="sticky top-0 z-50 shadow-xl"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Announcement Bar */}
      <div className="bg-amber-500 text-stone-900 py-2 px-4 text-center text-sm font-semibold tracking-wide">
        🚚 Free shipping on orders above ₹999!
      </div>

      {/* Main Navbar */}
      <div className="bg-stone-900 border-b border-stone-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* Logo / Mobile Search Input */}
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex md:hidden flex-1 items-center gap-2 pr-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-stone-850 border border-stone-700 text-white rounded-lg pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:border-amber-400 placeholder:text-stone-500"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                  className="text-stone-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>
            ) : (
              <Link
                href="/"
                className="text-2xl font-bold text-white hover:text-amber-400 transition-colors duration-200 flex-shrink-0"
                style={{ letterSpacing: '-0.03em' }}
              >
                {APP_NAME}
              </Link>
            )}

            {/* Desktop Nav Links */}
            {!isSearchOpen && (
              <div className="hidden md:flex items-center gap-1">
                <Link
                  href="/"
                  className="px-4 py-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg text-sm font-medium transition-colors duration-150"
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className="px-4 py-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg text-sm font-medium transition-colors duration-150"
                >
                  Products
                </Link>
                <Link
                  href="/products?newArrivals=true"
                  className="px-4 py-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg text-sm font-medium transition-colors duration-150"
                >
                  New Arrivals
                </Link>
                <Link
                  href="/products?sale=true"
                  className="px-4 py-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg text-sm font-medium transition-colors duration-150"
                >
                  Sale
                </Link>
              </div>
            )}

            {/* Right Side Icons */}
            <div className="flex items-center gap-1 ml-auto">
              {/* Search Bar - Desktop */}
              {isSearchOpen && (
                <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="bg-stone-850 border border-stone-700 text-white rounded-lg pl-3 pr-8 py-1.5 text-xs focus:outline-none focus:border-amber-400 w-44 lg:w-56 transition-all duration-300 placeholder:text-stone-500"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                    className="absolute right-2 text-stone-500 hover:text-stone-300"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}

              {/* Search Icon */}
              {!isSearchOpen && (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg transition-colors duration-150"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2.5 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg transition-colors duration-150"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-stone-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none">
                    {cart.totalItems > 9 ? '9+' : cart.totalItems}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {session ? (
                <div className="relative group hidden md:block">
                  <button className="flex items-center gap-2 pl-2.5 pr-3 py-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg transition-colors duration-150">
                    <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-stone-900 text-xs font-bold flex-shrink-0">
                      {session.user.name?.charAt(0).toUpperCase() ?? <User className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-sm font-medium max-w-[80px] truncate">{session.user.name}</span>
                    <span className="inline-block transition-transform duration-200 group-hover:rotate-180">
                      <svg className="w-3.5 h-3.5 ml-1 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-56 bg-stone-800 border border-stone-700 shadow-2xl rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0">
                    <div className="px-4 py-3 border-b border-stone-700 bg-stone-900/50">
                      <p className="font-bold text-white text-sm truncate">{session.user.name}</p>
                      <p className="text-stone-400 text-xs mt-0.5 truncate">{session.user.email}</p>
                    </div>
                    <Link
                      href="/orders"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-stone-300 hover:text-white hover:bg-stone-700 text-sm font-medium transition-colors duration-100"
                    >
                      <Package className="w-4 h-4 text-stone-400" />
                      My Orders
                    </Link>
                    <Link
                      href="/wishlist"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-stone-300 hover:text-white hover:bg-stone-700 text-sm font-medium transition-colors duration-100 border-t border-stone-750/30"
                    >
                      <Heart className="w-4 h-4 text-red-400 fill-red-400/20" />
                      Wishlist
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-stone-700 text-sm font-medium transition-colors duration-100 border-t border-stone-700"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:inline-flex items-center gap-2 ml-1 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-900 text-sm font-bold rounded-lg transition-colors duration-150 shadow-md"
                >
                  <User className="w-4 h-4" />
                  Login
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2.5 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg transition-colors duration-150"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-stone-900 border-b border-stone-700 px-4 pb-4">
          {/* Mobile Search Bar inside menu */}
          <div className="pt-2 pb-2">
            <form onSubmit={handleSearchSubmit} className="flex items-center relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-stone-850 border border-stone-750 text-white rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:border-amber-400 placeholder:text-stone-500"
              />
              <button type="submit" className="absolute right-3 text-stone-400 hover:text-white">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="space-y-1">
            <Link
              href="/"
              className="flex items-center px-3 py-2.5 text-stone-200 hover:text-white hover:bg-stone-800 rounded-lg text-sm font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="flex items-center px-3 py-2.5 text-stone-200 hover:text-white hover:bg-stone-800 rounded-lg text-sm font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/products?newArrivals=true"
              className="flex items-center px-3 py-2.5 text-stone-200 hover:text-white hover:bg-stone-800 rounded-lg text-sm font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              New Arrivals
            </Link>
            <Link
              href="/products?sale=true"
              className="flex items-center px-3 py-2.5 text-stone-200 hover:text-white hover:bg-stone-800 rounded-lg text-sm font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sale
            </Link>

            {/* Mobile User Section */}
            <div className="pt-2 border-t border-stone-700 mt-2">
              {session ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-stone-900 text-sm font-bold flex-shrink-0">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold">{session.user.name}</p>
                      <p className="text-stone-400 text-xs">{session.user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/orders"
                    className="flex items-center gap-2 px-3 py-2.5 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Package className="w-4 h-4 text-stone-400" />
                    My Orders
                  </Link>
                  <Link
                    href="/wishlist"
                    className="flex items-center gap-2 px-3 py-2.5 text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Heart className="w-4 h-4 text-red-400 fill-red-400/20" />
                    Wishlist
                  </Link>
                  <button
                    onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-red-400 hover:text-red-300 hover:bg-stone-800 rounded-lg text-sm font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold rounded-xl transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}