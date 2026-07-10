import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/db';
import Order from '../../../../models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

// GET: Fetch single order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const { id } = await params;

    const order = await Order.findById(id).populate('items.product');

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if user owns the order or is admin
    if (order.userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { orderStatus } = await request.json();
    const { id } = await params;

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    const isAdmin = session.user.role === 'admin';
    const isOwner = order.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    if (!isAdmin) {
      if (orderStatus !== 'cancellation_pending') {
        return NextResponse.json(
          { success: false, error: 'Unauthorized action' },
          { status: 403 }
        );
      }
      if (order.orderStatus === 'shipped' || order.orderStatus === 'delivered' || order.orderStatus === 'cancelled' || order.orderStatus === 'cancellation_pending') {
        return NextResponse.json(
          { success: false, error: 'Cannot request cancellation at this stage' },
          { status: 400 }
        );
      }
    }

    order.orderStatus = orderStatus;
    await order.save();

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}