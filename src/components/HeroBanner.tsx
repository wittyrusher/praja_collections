'use client';

import React, { useState, useEffect } from 'react';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop',
    tag: 'NEW SEASON',
  },
  {
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
    tag: 'NEW STOCK',
  },
  {
    image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=1200&auto=format&fit=crop',
    tag: 'MEGA SALE',
  },
];

export default function HeroBanner() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[400px] overflow-hidden bg-stone-900 group">
      {/* Slides */}
      {SLIDES.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.tag}
            className="w-full h-full object-cover object-center"
          />
          
          {/* Bottom fade gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

          {/* Floating tag — bottom left */}
          <div className="absolute bottom-5 left-5 bg-stone-950/60 backdrop-blur-md border border-stone-850 rounded-lg px-3 py-1.5 flex items-center justify-center z-20">
            <span className="text-[10px] font-bold text-white tracking-widest uppercase">
              {slide.tag}
            </span>
          </div>
        </div>
      ))}

      {/* Dots Indicator — bottom right */}
      <div className="absolute bottom-6 right-6 z-20 flex gap-2">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === activeIndex ? 'bg-amber-400 w-5' : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}