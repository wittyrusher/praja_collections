import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/db';
import Order from '../../../models/Order';
import Product from '../../../models/Product';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

// GET: Fetch user orders
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    const filter: any = {};

    // Admin can see all orders, users only their own
    if (session.user.role !== 'admin') {
      filter.userId = session.user.id;
    }

    if (status) {
      filter.orderStatus = status;
    }

    const orders = await Order.find(filter)
      .populate('items.product')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST: Create new order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { items, shippingAddress, razorpayOrderId } = await request.json();

    // Validate stock and calculate total
    let totalAmount = 0;
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
      totalAmount += item.price * item.quantity;
    }

    // Create order
    const order = await Order.create({
      userId: session.user.id,
      items,
      totalAmount,
      shippingAddress,
      paymentInfo: {
        razorpayOrderId,
        paymentStatus: 'pending',
      },
    });

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    return NextResponse.json(
      { success: true, order },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}