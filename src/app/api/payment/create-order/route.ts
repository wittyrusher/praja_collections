import { NextRequest, NextResponse } from 'next/server';
import { razorpayInstance, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from '../../../../lib/razorpay';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (RAZORPAY_KEY_ID === 'your_razorpay_key_id' || RAZORPAY_KEY_SECRET === 'your_razorpay_key_secret') {
      return NextResponse.json({ success: false, error: 'Razorpay keys are not configured. Please add valid keys to .env.local.' }, { status: 400 });
    }

    const { amount } = await request.json();

    const order = await razorpayInstance.orders.create({
      amount: Math.round(amount * 100), // paise, always an integer
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}