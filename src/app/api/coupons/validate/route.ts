import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Coupon from '@/models/Coupon';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { code, orderAmount } = await request.json();

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'Coupon code is required' },
        { status: 400 }
      );
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return NextResponse.json(
        { success: false, message: 'Invalid coupon code' },
        { status: 400 }
      );
    }

    if (!coupon.active) {
      return NextResponse.json(
        { success: false, message: 'This coupon is no longer active' },
        { status: 400 }
      );
    }

    const now = new Date();
    const expiry = new Date(coupon.expiryDate);
    // Extend validation till the end of the expiration day (23:59:59.999)
    expiry.setHours(23, 59, 59, 999);
    if (expiry < now) {
      return NextResponse.json(
        { success: false, message: 'This coupon has expired' },
        { status: 400 }
      );
    }

    if (orderAmount && orderAmount < coupon.minOrderAmount) {
      return NextResponse.json(
        {
          success: false,
          message: `Minimum order amount of ₹${coupon.minOrderAmount} is required to use this coupon`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
