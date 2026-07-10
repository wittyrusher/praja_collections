import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Tag, Truck, Sparkles, Star, Zap, Shirt, Smile, ShoppingBag, LayoutGrid } from 'lucide-react';
import HeroBanner from '../components/HeroBanner';
import ProductGrid from '../components/ProductGrid';
import { IProduct } from '../types/product';

export const dynamic = 'force-dynamic';

const CURATED_CATEGORIES = [
  {
    name: 'Men',
    slug: 'men',
    count: '120+ Items',
    image: '/images/men_category.png',
    bgClass: 'bg-stone-900/60 border border-stone-850 hover:border-amber-500/20 text-white',
    countColor: 'text-amber-400',
    icon: Shirt,
    btnClass: 'border border-amber-500/30 text-amber-400 group-hover:bg-amber-500 group-hover:border-amber-500 group-hover:text-stone-950',
    radialGlow: true,
  },
  {
    name: 'Women',
    slug: 'women',
    count: '150+ Items',
    image: '/images/women_category.png',
    bgClass: 'bg-[#e2d2be] text-stone-950 border border-[#d6c5b0] hover:bg-[#ebdccb]',
    countColor: 'text-amber-800',
    icon: Sparkles,
    btnClass: 'bg-stone-950 text-amber-400 group-hover:bg-amber-500 group-hover:text-stone-950',
    radialGlow: false,
  },
  {
    name: 'Kids',
    slug: 'kids',
    count: '80+ Items',
    image: '/images/kids_category.png',
    bgClass: 'bg-[#a6beb2] text-stone-950 border border-[#9ab2a6] hover:bg-[#b0c7b9]',
    countColor: 'text-amber-700',
    icon: Smile,
    btnClass: 'bg-stone-950 text-amber-400 group-hover:bg-amber-500 group-hover:text-stone-950',
    radialGlow: false,
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    count: '200+ Items',
    image: '/images/accessories_category.png',
    bgClass: 'bg-[#decbb7] text-stone-950 border border-[#d2bfa9] hover:bg-[#e7d4c1]',
    countColor: 'text-amber-800',
    icon: ShoppingBag,
    btnClass: 'bg-stone-950 text-amber-400 group-hover:bg-amber-500 group-hover:text-stone-950',
    radialGlow: false,
  },
];

import connectDB from '../lib/db';
import Product from '../models/Product';

async function getFeaturedProducts(): Promise<IProduct[]> {
  try {
    await connectDB();
    const products = await Product.find({ featured: true }).limit(8).lean();
    return JSON.parse(JSON.stringify(products)) as IProduct[];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

const FEATURES = [
  { icon: ShieldCheck, title: 'Quality guaranteed', desc: 'Every product meets strict quality standards before it reaches you.' },
  { icon: Tag, title: 'Best prices', desc: 'Competitive pricing with regular discounts, deals, and seasonal offers.' },
  { icon: Truck, title: 'Fast delivery', desc: '2-day delivery to your doorstep. Free shipping above ₹999.' },
];

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <main className="bg-stone-950 text-stone-200 min-h-screen" style={{ fontFamily: "'Georgia', serif" }}>

      {/* ── Hero ── */}
      <section className="container mx-auto px-4 pt-10 pb-16 lg:pt-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Copy */}
          <div>
            <span className="inline-flex items-center gap-2 bg-stone-900 border border-stone-800 text-amber-400 text-xs font-semibold tracking-widest uppercase px-3.5 py-1.5 rounded-full mb-6">
              <Sparkles className="w-3 h-3" /> New season arrivals
            </span>

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.08] mb-5"
              style={{ letterSpacing: '-0.02em' }}>
              Style that speaks <em className="text-amber-400 not-italic">louder</em> than words
            </h1>

            <p className="text-stone-400 text-base lg:text-lg leading-relaxed mb-8 max-w-md">
              Handpicked fashion for every occasion — trends, classics, and everything in between.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold px-6 py-3 rounded-xl transition-all text-sm shadow-lg shadow-amber-500/20 active:scale-95"
              >
                Shop now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products?featured=true"
                className="inline-flex items-center gap-2 border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white font-medium px-6 py-3 rounded-xl transition-all text-sm active:scale-95"
              >
                View lookbook
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-stone-850 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-base font-bold text-white leading-none">12K+</p>
                  <p className="text-[11px] text-stone-500 mt-1 font-medium tracking-wide uppercase">Products</p>
                </div>
              </div>
              <div className="w-px h-8 bg-stone-850 hidden sm:block" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                </div>
                <div>
                  <p className="text-base font-bold text-white leading-none">4.9★</p>
                  <p className="text-[11px] text-stone-500 mt-1 font-medium tracking-wide uppercase">Avg rating</p>
                </div>
              </div>
              <div className="w-px h-8 bg-stone-850 hidden sm:block" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-base font-bold text-white leading-none">2-day</p>
                  <p className="text-[11px] text-stone-500 mt-1 font-medium tracking-wide uppercase">Delivery</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative">
            <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden border border-stone-800/85 shadow-2xl">
              <HeroBanner />
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="bg-stone-900/40 border-y border-stone-800 py-14">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-amber-500 mb-1">Curated picks</p>
              <h2 className="text-2xl font-bold text-white" style={{ letterSpacing: '-0.01em' }}>Featured products</h2>
              <p className="text-stone-500 text-sm mt-1">Our editors' top selections this season</p>
            </div>
            <Link href="/products?featured=true"
              className="hidden sm:inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-sm font-semibold transition-colors">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <ProductGrid products={featuredProducts} />

          <div className="sm:hidden mt-6 text-center">
            <Link href="/products?featured=true"
              className="inline-flex items-center gap-2 border border-stone-700 text-stone-300 text-sm font-medium px-5 py-2.5 rounded-xl hover:border-stone-500 transition-colors">
              View all products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="container mx-auto px-4 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-amber-500 mb-1">Explore</p>
            <h2 className="text-3xl font-serif font-bold text-white tracking-tight">Shop by category</h2>
            <p className="text-stone-500 text-sm mt-1">Find exactly what you need from our carefully curated categories.</p>
          </div>
          <Link href="/products"
            className="hidden sm:inline-flex items-center gap-2 border border-stone-800 hover:border-stone-700 text-stone-300 hover:text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors bg-stone-900/40">
            <LayoutGrid className="w-3.5 h-3.5" />
            All categories <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CURATED_CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className={`group aspect-[3/4] rounded-3xl p-6 flex flex-col justify-between overflow-hidden relative transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl shadow-md ${cat.bgClass}`}
              >
                {/* Radial Glow */}
                {cat.radialGlow && (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15)_0%,transparent_65%)] pointer-events-none" />
                )}

                {/* Floating Badge */}
                <div className="w-10 h-10 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center relative z-20 shadow-md">
                  <IconComponent className="w-4.5 h-4.5" />
                </div>

                {/* Product Image */}
                <div className="relative flex-grow flex items-center justify-center z-10 w-full h-44 my-2">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-350"
                  />
                </div>

                {/* Bottom Title and Action */}
                <div className="text-center relative z-20">
                  <h3 className="font-serif font-bold text-lg leading-tight tracking-tight mb-0.5">
                    {cat.name}
                  </h3>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${cat.countColor}`}>
                    {cat.count}
                  </p>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center mx-auto transition-all duration-200 ${cat.btnClass}`}>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <div className="container mx-auto px-4 pb-14">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-7 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden border border-amber-400/20">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            {/* Circular dark icon badge */}
            <div className="w-14 h-14 rounded-full bg-stone-950 flex items-center justify-center flex-shrink-0 shadow-md">
              <ShoppingBag className="w-6 h-6 text-amber-400 fill-amber-400/10" />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-xl md:text-2xl font-serif font-bold text-stone-950 tracking-tight leading-tight">
                New arrivals dropping every week
              </h3>
              <p className="text-amber-950/80 text-sm mt-1 font-medium">
                Stay updated with the latest trends and exclusive collections.
              </p>
            </div>
          </div>
          <Link
            href="/products"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-stone-950 hover:bg-stone-900 text-amber-400 hover:text-white font-bold text-sm px-6 py-3 rounded-xl transition-all duration-150 shadow-lg active:scale-95 border border-stone-850"
          >
            Browse new arrivals <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ── Features ── */}
      <section className="bg-stone-900/40 border-t border-stone-800 py-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
                <div className="w-10 h-10 bg-stone-950 border border-stone-800 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">{title}</h3>
                <p className="text-xs text-stone-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}