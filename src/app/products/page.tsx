'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductGrid from '@/components/ProductGrid';
import CategoryFilter from '@/components/CategoryFilter';
import Loading from '@/components/ui/Loading';
import { IProduct } from '@/types/product';
import { SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Read sort value directly from URL so the select stays in sync
  const currentSort = searchParams.get('sort') || 'featured';

  // Re-fetch whenever searchParams (category, sort) or currentPage changes
  // Using .toString() ensures a stable primitive dependency for useEffect
  useEffect(() => {
    fetchProducts();
  }, [searchParams.toString(), currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', currentPage.toString());

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setProducts(data.products);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    // Always reset to page 1 when sort changes
    params.set('page', '1');
    setCurrentPage(1);
    router.push(`/products?${params.toString()}`);
  };

  if (loading) return <Loading text="Loading products..." />;

  return (
    <div
      className="min-h-screen bg-stone-50"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Page Header */}
      <div className="bg-stone-900 text-white px-6 py-10">
        <div className="container mx-auto">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-1">Shop</p>
          <h1
            className="text-4xl font-bold text-white capitalize"
            style={{ letterSpacing: '-0.03em' }}
          >
            {searchParams.get('search')
              ? `Search Results`
              : searchParams.get('newArrivals') === 'true'
              ? 'New Arrivals'
              : searchParams.get('sale') === 'true'
              ? 'Seasonal Sale'
              : searchParams.get('category')
              ? `${searchParams.get('category')} Collection`
              : 'All Products'}
          </h1>
          <p className="text-black mt-2 text-sm">
            {searchParams.get('search')
              ? `Showing results for "${searchParams.get('search')}"`
              : 'Discover our full collection'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-white text-sm font-semibold rounded-xl"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {showMobileFilter ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className={`lg:col-span-1 ${showMobileFilter ? 'block' : 'hidden lg:block'}`}>
            <CategoryFilter />
          </div>

          {/* Products Area */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 bg-white border border-stone-200 rounded-xl px-4 py-3 shadow-sm">
              <p className="text-stone-700 text-sm font-semibold">
                <span className="text-stone-900 font-bold">{products.length}</span>
                <span className="text-black"> products found</span>
              </p>
              <div className="flex items-center gap-2">
                <label className="text-black text-xs font-medium uppercase tracking-wide hidden sm:block">
                  Sort
                </label>
                {/* value={currentSort} keeps the select in sync with the URL */}
                <select
                  value={currentSort}
                  onChange={handleSortChange}
                  className="border border-stone-200 bg-white text-stone-900 text-sm font-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            <ProductGrid products={products} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-10 gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-stone-200 text-stone-700 text-sm font-semibold rounded-xl hover:bg-stone-900 hover:text-white hover:border-stone-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-colors duration-150 ${currentPage === page
                          ? 'bg-stone-900 text-white shadow-md'
                          : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-stone-200 text-stone-700 text-sm font-semibold rounded-xl hover:bg-stone-900 hover:text-white hover:border-stone-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 shadow-sm"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<Loading text="Loading products..." />}>
      <ProductsContent />
    </Suspense>
  );
}