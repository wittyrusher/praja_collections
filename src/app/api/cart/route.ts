import { NextRequest, NextResponse } from 'next/server';

/**
 * Cart API Route
 * Note: Cart functionality is primarily handled client-side via CartContext
 * This route exists for compatibility and future server-side cart features
 */

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Cart is managed client-side',
    info: 'Use CartContext from @/context/CartContext',
  });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Cart operations handled client-side',
  });
}

export async function PUT(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Cart updates handled client-side',
  });
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Cart deletion handled client-side',
  });
}