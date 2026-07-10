import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectDB();
    const categories = await Product.distinct('category');
    
    const formattedCategories = categories
      .filter((cat): cat is string => typeof cat === 'string' && cat.trim() !== '')
      .map((cat: string) => {
        const name = cat
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        return { name, slug: cat.toLowerCase() };
      });
    
    return NextResponse.json({ success: true, categories: formattedCategories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
