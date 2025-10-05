import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '../../../../lib/db';
import Order from '../../../../models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } =
      await request.json();

    // Verify signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    const isValid = expectedSignature === razorpaySignature;

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Update order payment status
    await connectDB();

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        'paymentInfo.razorpayPaymentId': razorpayPaymentId,
        'paymentInfo.razorpaySignature': razorpaySignature,
        'paymentInfo.paymentStatus': 'completed',
        orderStatus: 'processing',
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      order,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}