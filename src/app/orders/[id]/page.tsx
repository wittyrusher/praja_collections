'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  ArrowLeft,
  ShoppingBag,
  Ban,
  CheckCircle,
  MapPin,
  CreditCard,
  Headphones,
  ArrowRight,
  ClipboardList,
  Settings,
  Truck,
  CheckCircle2,
  Package,
  Clock,
} from 'lucide-react';
import { IOrder } from '../../../types/order';
import { formatCurrency, formatDate } from '../../../utils/helpers';
import Loading from '../../../components/ui/Loading';
import toast from 'react-hot-toast';
import PayNowButton from '../../../components/checkout/PayNowButton';

const getStepDates = (createdAtStr: string | Date, currentStatus: string) => {
  const createdAt = new Date(createdAtStr);

  const formatTimeStr = (d: Date) =>
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const formatDateStr = (d: Date) =>
    d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  const pendingDate = formatDateStr(createdAt);
  const pendingTime = formatTimeStr(createdAt);

  const procTime = new Date(createdAt.getTime() + 45 * 60 * 1000);
  const processingDate = formatDateStr(procTime);
  const processingTime = formatTimeStr(procTime);

  const shipTime = new Date(createdAt.getTime() + 2 * 24 * 60 * 60 * 1000);
  const shippedDate = formatDateStr(shipTime);

  const delTime = new Date(createdAt.getTime() + 4 * 24 * 60 * 60 * 1000);
  const deliveredDate = formatDateStr(delTime);

  return {
    pending: { date: pendingDate, time: pendingTime },
    processing: { date: processingDate, time: processingTime },
    shipped: { date: shippedDate, isExpected: !['shipped', 'delivered'].includes(currentStatus) },
    delivered: { date: deliveredDate, isExpected: currentStatus !== 'delivered' },
  };
};

const getStatusMessage = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Your order is pending payment. Please complete the payment to process your order.';
    case 'processing':
      return "We're working on your order. You'll receive an update once it ships.";
    case 'shipped':
      return 'Your order has been shipped and is on its way to you!';
    case 'delivered':
      return 'Your order has been successfully delivered. Thank you for shopping with us!';
    case 'cancelled':
      return 'This order has been cancelled.';
    case 'cancellation_pending':
      return 'Your cancellation request is pending admin approval.';
    default:
      return "We're working on your order. You'll receive an update once it ships.";
  }
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'delivered': return 'bg-green-50 text-green-700 border border-green-200';
    case 'processing': return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'shipped': return 'bg-purple-50 text-purple-700 border border-purple-200';
    case 'cancelled': return 'bg-red-50 text-red-700 border border-red-200';
    case 'cancellation_pending': return 'bg-rose-50 text-rose-700 border border-rose-200';
    default: return 'bg-amber-50 text-amber-700 border border-amber-200';
  }
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/orders');
    } else if (status === 'authenticated') {
      fetchOrder();
    }
  }, [status, params.id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
      } else {
        toast.error('Order not found');
        router.push('/orders');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to request order cancellation?')) return;
    try {
      setCancelling(true);
      const res = await fetch(`/api/orders/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: 'cancellation_pending' }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Cancellation request submitted successfully');
        fetchOrder();
      } else {
        toast.error(data.error || 'Failed to request cancellation');
      }
    } catch (error) {
      toast.error('Failed to request cancellation');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusIndex = (s: string) => {
    return ['pending', 'processing', 'shipped', 'delivered'].indexOf(s);
  };

  if (status === 'loading' || loading) {
    return <Loading text="Loading order details..." />;
  }

  if (!session || !order) {
    return null;
  }

  const currentStatusIndex = getStatusIndex(order.orderStatus);
  const stepDates = getStepDates(order.createdAt, order.orderStatus);

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = (order as any).discount || 0;
  const couponCode = (order as any).couponCode;
  const shipping = (order as any).shipping || 0;

  const showTimeline = order.orderStatus !== 'cancelled' && order.orderStatus !== 'cancellation_pending';
  const canCancel = order.orderStatus !== 'cancelled' && order.orderStatus !== 'cancellation_pending' && order.orderStatus !== 'delivered' && order.orderStatus !== 'shipped';

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 py-12">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/orders"
            className="inline-flex items-center text-sm font-semibold text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Orders
          </Link>
        </div>

        {/* Order Header Card */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100 flex-shrink-0">
                <ShoppingBag className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl font-extrabold text-stone-900">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusBadgeClass(order.orderStatus)}`}>
                    {order.orderStatus === 'cancellation_pending'
                      ? 'Cancellation Pending'
                      : order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-1 font-medium">
                  Placed on {formatDate(order.createdAt)} • {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
                </p>
              </div>
            </div>

            {canCancel && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl transition duration-150 active:scale-[0.98] disabled:opacity-50"
              >
                <Ban className="w-3.5 h-3.5" />
                {cancelling ? 'Requesting...' : 'Request Cancel Order'}
              </button>
            )}
          </div>

          <div className="pt-4 flex items-start gap-2.5 text-xs text-stone-600 font-medium">
            <div className="w-4 h-4 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <span>{getStatusMessage(order.orderStatus)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Timeline Progress */}
            {showTimeline && (
              <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm">
                <h2 className="text-sm font-extrabold text-stone-900 tracking-wide mb-6 uppercase">Order Status</h2>

                <div className="relative">
                  {/* Connector Lines */}
                  <div className="absolute top-6 left-0 right-0 h-0.5 -translate-y-1/2 hidden sm:block pointer-events-none z-0">
                    <div className={`absolute left-[12.5%] w-[25%] h-0.5 ${currentStatusIndex >= 1 ? 'bg-amber-500' : 'border-t-2 border-dashed border-stone-200'}`} />
                    <div className={`absolute left-[37.5%] w-[25%] h-0.5 ${currentStatusIndex >= 2 ? 'bg-amber-500' : 'border-t-2 border-dashed border-stone-200'}`} />
                    <div className={`absolute left-[62.5%] w-[25%] h-0.5 ${currentStatusIndex >= 3 ? 'bg-amber-500' : 'border-t-2 border-dashed border-stone-200'}`} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-2 relative z-10">
                    {/* Step 1: Pending */}
                    <div className="flex sm:flex-col items-center gap-3 sm:gap-1.5 text-center">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 bg-amber-50 border-amber-500 text-amber-500 flex-shrink-0">
                        <ClipboardList className="w-5 h-5" />
                      </div>
                      <div className="text-left sm:text-center">
                        <p className="text-xs font-bold text-stone-900">Pending</p>
                        <p className="text-[10px] text-stone-500 font-semibold mt-0.5">{stepDates.pending.date}</p>
                        <p className="text-[9px] text-stone-400 font-medium">{stepDates.pending.time}</p>
                      </div>
                    </div>

                    {/* Step 2: Processing */}
                    <div className="flex sm:flex-col items-center gap-3 sm:gap-1.5 text-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${currentStatusIndex >= 1 ? 'bg-amber-50 border-amber-500 text-amber-500' : 'bg-white border-stone-200 text-stone-400'}`}>
                        <Settings className="w-5 h-5" />
                      </div>
                      <div className="text-left sm:text-center">
                        <p className={`text-xs font-bold ${currentStatusIndex >= 1 ? 'text-stone-900' : 'text-stone-400'}`}>Processing</p>
                        {currentStatusIndex >= 1 ? (
                          <>
                            <p className="text-[10px] text-stone-500 font-semibold mt-0.5">{stepDates.processing.date}</p>
                            <p className="text-[9px] text-stone-400 font-medium">{stepDates.processing.time}</p>
                          </>
                        ) : (
                          <p className="text-[10px] text-stone-400 font-medium mt-0.5">Awaiting setup</p>
                        )}
                      </div>
                    </div>

                    {/* Step 3: Shipped */}
                    <div className="flex sm:flex-col items-center gap-3 sm:gap-1.5 text-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${currentStatusIndex >= 2 ? 'bg-amber-50 border-amber-500 text-amber-500' : 'bg-white border-stone-200 text-stone-400'}`}>
                        <Truck className="w-5 h-5" />
                      </div>
                      <div className="text-left sm:text-center">
                        <p className={`text-xs font-bold ${currentStatusIndex >= 2 ? 'text-stone-900' : 'text-stone-400'}`}>Shipped</p>
                        <p className="text-[10px] text-stone-500 font-semibold mt-0.5">
                          {stepDates.shipped.isExpected ? `Expected: ${stepDates.shipped.date}` : stepDates.shipped.date}
                        </p>
                      </div>
                    </div>

                    {/* Step 4: Delivered */}
                    <div className="flex sm:flex-col items-center gap-3 sm:gap-1.5 text-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${currentStatusIndex >= 3 ? 'bg-amber-50 border-amber-500 text-amber-500' : 'bg-white border-stone-200 text-stone-400'}`}>
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="text-left sm:text-center">
                        <p className={`text-xs font-bold ${currentStatusIndex >= 3 ? 'text-stone-900' : 'text-stone-400'}`}>Delivered</p>
                        <p className="text-[10px] text-stone-500 font-semibold mt-0.5">
                          {stepDates.delivered.isExpected ? `Expected: ${stepDates.delivered.date}` : stepDates.delivered.date}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-3.5 bg-amber-50/50 border border-amber-100 rounded-xl flex items-start gap-2.5 text-xs font-medium text-stone-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  <span>{getStatusMessage(order.orderStatus)}</span>
                </div>
              </div>
            )}

            {/* Cancelled Banner */}
            {order.orderStatus === 'cancelled' && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600 flex-shrink-0">
                  <Ban className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-red-950 text-sm">Order Cancelled</h3>
                  <p className="text-xs text-red-700 mt-1 leading-relaxed">
                    This order has been cancelled and will not be processed further. If payment was made, your refund is being initiated automatically.
                  </p>
                </div>
              </div>
            )}

            {/* Cancellation Pending Banner */}
            {order.orderStatus === 'cancellation_pending' && (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 flex-shrink-0">
                  <Clock className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-amber-950 text-sm">Cancellation Request Pending</h3>
                  <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                    Your cancellation request has been submitted. Our admin team will review and approve it shortly. Please do not make a new order for the same items until confirmed.
                  </p>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm">
              <h2 className="text-sm font-extrabold text-stone-900 tracking-wide mb-6 uppercase">Order Items</h2>

              {/* Table Header */}
              <div className="hidden sm:grid grid-cols-12 gap-4 pb-4 border-b border-stone-100 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                <div className="col-span-6">Item</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Items */}
              <div className="divide-y divide-stone-100">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-4 py-5 items-center first:pt-0 last:pb-0"
                  >
                    <div className="col-span-1 sm:col-span-6 flex items-center gap-4">
                      <div className="relative w-16 h-16 bg-stone-50 rounded-xl overflow-hidden border border-stone-100 flex-shrink-0">
                        {typeof item.product === 'object' && item.product.images ? (
                          <img
                            src={item.product.images[0] || '/placeholder-product.jpg'}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-stone-100">
                            <Package className="w-6 h-6 text-stone-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-stone-900 leading-tight">
                          {typeof item.product === 'object' ? item.product.name : 'Product'}
                        </h4>
                        <p className="text-xs text-stone-500 mt-1 font-semibold">
                          {item.size && `Size: ${item.size}`}
                          {item.size && item.color && ' • '}
                          {item.color && `Color: ${item.color}`}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-1 sm:col-span-2 flex sm:block items-center justify-between text-xs sm:text-sm">
                      <span className="sm:hidden text-stone-400 font-bold uppercase text-[10px]">Price</span>
                      <span className="font-extrabold text-stone-900 sm:text-center sm:block">{formatCurrency(item.price)}</span>
                    </div>

                    <div className="col-span-1 sm:col-span-2 flex sm:block items-center justify-between text-xs sm:text-sm">
                      <span className="sm:hidden text-stone-400 font-bold uppercase text-[10px]">Quantity</span>
                      <span className="font-bold text-stone-900 bg-stone-50 px-2.5 py-0.5 rounded-lg border border-stone-200/60 sm:border-0 sm:text-center sm:block">{item.quantity}</span>
                    </div>

                    <div className="col-span-1 sm:col-span-2 flex sm:block items-center justify-between text-xs sm:text-sm">
                      <span className="sm:hidden text-stone-400 font-bold uppercase text-[10px]">Total</span>
                      <span className="font-extrabold text-stone-900 sm:text-right sm:block">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-6 pt-6 border-t border-stone-100 flex justify-end">
                <div className="w-full sm:w-80 space-y-3.5 text-xs font-semibold">
                  <div className="flex justify-between items-center text-stone-500">
                    <span>Subtotal</span>
                    <span className="text-stone-900 font-bold">{formatCurrency(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between items-center text-green-600">
                      <span>Discount {couponCode ? `(${couponCode})` : ''}</span>
                      <span className="font-extrabold">-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-stone-500">
                    <span>Shipping</span>
                    {shipping > 0 ? (
                      <span className="text-stone-900 font-bold">{formatCurrency(shipping)}</span>
                    ) : (
                      <span className="text-green-600 font-extrabold">FREE</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-stone-500">
                    <span>Tax (GST 18%)</span>
                    <span className="text-stone-900 font-bold">
                      {formatCurrency(Math.round((subtotal - discount) * 0.18))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-extrabold pt-3.5 border-t border-stone-100 text-stone-900">
                    <span className="text-base font-black">Total Amount</span>
                    <span className="text-lg font-black">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-stone-50">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-500" />
                  <h3 className="font-extrabold text-stone-900 text-xs tracking-wider uppercase">Shipping Address</h3>
                </div>
                <button className="text-[11px] font-bold text-amber-500 hover:text-amber-600 transition-colors">
                  Edit
                </button>
              </div>
              <div className="text-xs text-stone-600 font-semibold space-y-2.5">
                <p className="font-black text-stone-900 text-[13px]">{order.shippingAddress.name}</p>
                <p className="font-extrabold text-stone-800">{order.shippingAddress.phone}</p>
                <div className="text-stone-500 leading-relaxed space-y-1">
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pb-2.5 border-b border-stone-50">
                <CreditCard className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-stone-900 text-xs tracking-wider uppercase">Payment Information</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-stone-500">Payment Method</span>
                  <span className="font-extrabold text-stone-900">Razorpay</span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-stone-500">Payment Status</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-lg font-bold text-[10px] uppercase border ${order.paymentInfo.paymentStatus === 'completed'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : order.paymentInfo.paymentStatus === 'failed'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                  >
                    {order.paymentInfo.paymentStatus}
                  </span>
                </div>
                {order.paymentInfo.paymentStatus === 'pending' && (
                  <div className="pt-2">
                    <PayNowButton orderId={order._id as string} amount={order.totalAmount} />
                  </div>
                )}
                {order.paymentInfo.razorpayPaymentId && (
                  <div className="pt-3 border-t border-stone-100 text-xs text-stone-500">
                    <p className="font-extrabold text-stone-400">Payment ID</p>
                    <p className="font-mono mt-1.5 text-[11px] break-all leading-relaxed bg-stone-50 p-2 rounded-lg border border-stone-100 text-stone-600">
                      {order.paymentInfo.razorpayPaymentId}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Need Help? */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Headphones className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-stone-900 text-xs tracking-wider uppercase">Need Help?</h3>
              </div>
              <p className="text-xs text-stone-500 font-semibold leading-relaxed mb-4">
                Contact our customer support for any order-related queries.
              </p>
              <button className="w-full flex items-center justify-between px-4 py-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs font-black text-stone-900 rounded-xl transition duration-150 active:scale-[0.98]">
                <span>Contact Support</span>
                <ArrowRight className="w-4 h-4 text-stone-600" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}