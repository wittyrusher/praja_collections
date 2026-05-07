'use client';

import React from 'react';
import Image from 'next/image';

export default function HeroBanner() {
  return (
    <div className="relative w-full h-full min-h-[460px] rounded-2xl overflow-hidden bg-stone-900 border border-stone-800">

      {/* Main hero image — full bleed */}
      <Image
        src="/images/hero-image.jpg"
        alt="Fashion hero"
        fill
        className="object-cover object-top"
        priority
      />

      {/* Bottom fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

      {/* Floating tag — top left */}
      <div className="absolute top-4 left-4 bg-stone-950/80 backdrop-blur-sm border border-stone-700 rounded-full px-3 py-1.5 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        <span className="text-xs font-semibold text-amber-400 tracking-widest uppercase">SS '26</span>
      </div>

      {/* Bottom overlay — label */}
      <div className="absolute bottom-0 left-0 right-0 px-5 py-5">
        <p className="text-xs font-semibold tracking-widest uppercase text-stone-500 mb-1">New season</p>
        <h3 className="text-xl font-bold text-white leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
          Praja Collections
        </h3>
      </div>
    </div>
  );
}