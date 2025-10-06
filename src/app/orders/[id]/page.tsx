'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Package, MapPin, CreditCard, CheckCircle, ArrowLeft } from 'lucide-react';
import { IOrder } from '../../../types/order';
import { formatCurrency, formatDate } from '../../../utils/helpers';
import Loading from '../../../components/ui/Loading';
import Button from '../../../components/ui/Button';
import { ORDER_STATUS } from '../../../utils/constants';
import toast from 'react-hot-toast';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);

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

  const getStatusColor = (status: string) => {
    const statusObj = ORDER_STATUS.find((s) => s.value === status);
    const colors: any = {
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      blue: 'bg-white-100 text-blue-800 border-blue-300',
      purple: 'bg-purple-100 text-purple-800 border-purple-300',
      green: 'bg-green-100 text-green-800 border-green-300',
      red: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[statusObj?.color || 'yellow'];
  };

  const getStatusIndex = (status: string) => {
    return ORDER_STATUS.findIndex((s) => s.value === status);
  };

  if (status === 'loading' || loading) {
    return <Loading text="Loading order details..." />;
  }

  if (!session || !order) {
    return null;
  }

  const currentStatusIndex = getStatusIndex(order.orderStatus);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/orders"
        className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Orders
      </Link>

      {/* Order Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-gray-600">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                order.orderStatus
              )}`}
            >
              {ORDER_STATUS.find((s) => s.value === order.orderStatus)?.label ||
                order.orderStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Order Timeline */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-6">Order Status</h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          {ORDER_STATUS.filter((s) => s.value !== 'cancelled').map(
            (status, index) => {
              const isActive = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;

              return (
                <div key={status.value} className="relative flex items-start mb-8 last:mb-0">
                  <div
                    className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      isActive
                        ? 'bg-primary-600 border-primary-600'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    {isActive && (
                      <CheckCircle className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="ml-4">
                    <p
                      className={`font-semibold ${
                        isActive ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {status.label}
                    </p>
                    {isCurrent && (
                      <p className="text-sm text-gray-600 mt-1">
                        Current Status
                      </p>
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>

        {order.orderStatus === 'cancelled' && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-semibold">Order Cancelled</p>
            <p className="text-sm text-red-600 mt-1">
              This order has been cancelled
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 pb-4 border-b last:border-b-0"
                >
                  <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {typeof item.product === 'object' && item.product.images ? (
                      <img
                        src={
                          item.product.images[0] || '/placeholder-product.jpg'
                        }
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-900">
                      {typeof item.product === 'object'
                        ? item.product.name
                        : 'Product'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.size && `Size: ${item.size}`}
                      {item.size && item.color && ' • '}
                      {item.color && `Color: ${item.color}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">
                  {formatCurrency(
                    order.items.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0
                    )
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (GST 18%)</span>
                <span className="font-semibold">
                  {formatCurrency(order.totalAmount * 0.153)} {/* Reverse calculate tax */}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span className="text-primary-600">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="w-5 h-5 text-primary-600" />
              <h3 className="font-bold text-gray-900">Shipping Address</h3>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-semibold">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.phone}</p>
              <p className="mt-2">{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </p>
              <p>
                {order.shippingAddress.pincode}, {order.shippingAddress.country}
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="w-5 h-5 text-primary-600" />
              <h3 className="font-bold text-gray-900">Payment Information</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-semibold">Razorpay</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Status</span>
                <span
                  className={`font-semibold ${
                    order.paymentInfo.paymentStatus === 'completed'
                      ? 'text-green-600'
                      : order.paymentInfo.paymentStatus === 'failed'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {order.paymentInfo.paymentStatus.toUpperCase()}
                </span>
              </div>
              {order.paymentInfo.razorpayPaymentId && (
                <div className="text-xs text-gray-500 mt-4 pt-4 border-t">
                  <p>Payment ID:</p>
                  <p className="font-mono break-all">
                    {order.paymentInfo.razorpayPaymentId}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Need Help */}
          <div className="bg-primary-50 rounded-lg p-6 border border-primary-200">
            <h3 className="font-bold text-primary-900 mb-2">Need Help?</h3>
            <p className="text-sm text-primary-800 mb-4">
              Contact our customer support for any order-related queries.
            </p>
            <Button variant="primary" size="sm" className="w-full">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}