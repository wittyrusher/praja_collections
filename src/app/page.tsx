import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Tag, Truck, Sparkles } from 'lucide-react';
import HeroBanner from '../components/HeroBanner';
import ProductGrid from '../components/ProductGrid';
import { IProduct } from '../types/product';

export const dynamic = 'force-dynamic';

async function getFeaturedProducts(): Promise<IProduct[]> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/products?featured=true&limit=8`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

const STATS = [
  { value: '12K+', label: 'Products' },
  { value: '4.9★', label: 'Avg rating' },
  { value: '2-day', label: 'Delivery' },
];

const CATEGORIES = [
  { name: 'Men', slug: 'men', emoji: '👔', count: '480' },
  { name: 'Women', slug: 'women', emoji: '👗', count: '620' },
  { name: 'Kids', slug: 'kids', emoji: '👶', count: '215' },
  { name: 'Accessories', slug: 'accessories', emoji: '👜', count: '340' },
];

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
            <span className="inline-flex items-center gap-2 bg-stone-900 border border-stone-800 text-amber-400 text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full mb-6">
              <Sparkles className="w-3 h-3" /> New season arrivals
            </span>

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.08] mb-5"
              style={{ letterSpacing: '-0.02em' }}>
              Style that speaks{' '}
              <em className="text-amber-400 not-italic">louder</em>{' '}
              than words
            </h1>

            <p className="text-stone-400 text-base lg:text-lg leading-relaxed mb-8 max-w-md">
              Handpicked fashion for every occasion — trends, classics, and everything in between.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold px-6 py-3 rounded-xl transition-colors text-sm shadow-lg shadow-amber-500/20"
              >
                Shop now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/products?featured=true"
                className="inline-flex items-center gap-2 border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white font-medium px-6 py-3 rounded-xl transition-colors text-sm"
              >
                View lookbook
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-stone-800">
              {STATS.map((s, i) => (
                <React.Fragment key={s.label}>
                  {i > 0 && <div className="w-px h-8 bg-stone-800" />}
                  <div>
                    <p className="text-xl font-bold text-amber-400">{s.value}</p>
                    <p className="text-xs text-stone-500 mt-0.5">{s.label}</p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden aspect-square border border-stone-800">
              <HeroBanner />
            </div>
            <div className="absolute bottom-4 left-4 bg-stone-950/90 backdrop-blur-sm border border-stone-800 rounded-xl px-3 py-2 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              <span className="text-xs text-stone-400">
                <strong className="text-white font-semibold">340 people</strong> shopping now
              </span>
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
            <h2 className="text-2xl font-bold text-white" style={{ letterSpacing: '-0.01em' }}>Shop by category</h2>
          </div>
          <Link href="/products"
            className="hidden sm:inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-sm font-semibold transition-colors">
            All categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} href={`/products?category=${cat.slug}`}
              className="group bg-stone-900 border border-stone-800 hover:border-amber-500/40 rounded-2xl p-6 text-center transition-all duration-200 hover:-translate-y-1">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">{cat.emoji}</div>
              <h3 className="text-sm font-bold text-white mb-0.5">{cat.name}</h3>
              <p className="text-xs text-stone-500">{cat.count} items</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <div className="container mx-auto px-4 pb-14">
        <div className="bg-amber-500 rounded-2xl px-8 py-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-stone-900">New arrivals dropping every week</h3>
            <p className="text-amber-800 text-sm mt-0.5">Subscribe and get 10% off your first order</p>
          </div>
          <Link href="/products"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-sm px-6 py-3 rounded-xl transition-colors">
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