import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import Order from '../../../models/Order';
import Product from '../../../models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const status = request.nextUrl.searchParams.get('status');
    const filter: any = session.user.role !== 'admin' ? { userId: session.user.id } : {};
    if (status) filter.orderStatus = status;

    const orders = await Order.find(filter)
      .populate('items.product')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { items, shippingAddress, paymentMethod, razorpayOrderId, couponCode } =
      await request.json();

    const isCOD = paymentMethod === 'cod';

    // Validate stock and compute total
    let subtotal = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product not found: ${item.product}` },
          { status: 404 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }
      subtotal += item.price * item.quantity;
    }

    let shipping = subtotal > 999 ? 0 : 50;
    if (couponCode === 'prajafreedel') {
      shipping = 0;
    }
    const tax = Math.round(subtotal * 0.18);
    const totalAmount = subtotal + shipping + tax;

    const order = await Order.create({
      userId: session.user.id,
      items,
      totalAmount,
      shippingAddress,
      paymentInfo: {
        // Only set razorpayOrderId when it's a real non-empty string
        ...(razorpayOrderId ? { razorpayOrderId } : {}),
        paymentStatus: 'pending',
      },
      orderStatus: 'pending',
    });

    // COD: deduct stock immediately — payment is guaranteed on delivery
    // Razorpay: stock deducted in /api/payment/verify after signature check
    if (isCOD) {
      for (const item of items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}