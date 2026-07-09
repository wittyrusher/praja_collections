import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '../../../../lib/db';
import Order from '../../../../models/Order';
import Product from '../../../../models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } =
      await request.json();

    // Verify Razorpay signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        'paymentInfo.razorpayPaymentId': razorpayPaymentId,
        'paymentInfo.razorpaySignature': razorpaySignature,
        'paymentInfo.paymentStatus': 'completed',
        orderStatus: 'processing',  // ✅ valid enum value
      },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Deduct stock now that payment is verified
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      order,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}