'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Eye, ShoppingBag } from 'lucide-react';
import { IOrder } from '../../types/order';
import { formatCurrency, formatDate } from '../../utils/helpers';
import Loading from '../../components/ui/Loading';
import Button from '../../components/ui/Button';
import { ORDER_STATUS } from '../../utils/constants';

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/orders');
    } else if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status, filterStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url =
        filterStatus === 'all'
          ? '/api/orders'
          : `/api/orders?status=${filterStatus}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusObj = ORDER_STATUS.find((s) => s.value === status);
    const colors: any = {
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      blue: 'bg-blue-100 text-blue-800 border-blue-300',
      purple: 'bg-purple-100 text-purple-800 border-purple-300',
      green: 'bg-green-100 text-green-800 border-green-300',
      red: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[statusObj?.color || 'yellow'];
  };

  if (status === 'loading' || loading) {
    return <Loading text="Loading your orders..." />;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">Track and manage your orders</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-6 py-4 font-medium whitespace-nowrap border-b-2 transition ${
              filterStatus === 'all'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            All Orders ({orders.length})
          </button>
          {ORDER_STATUS.map((status) => (
            <button
              key={status.value}
              onClick={() => setFilterStatus(status.value)}
              className={`px-6 py-4 font-medium whitespace-nowrap border-b-2 transition ${
                filterStatus === status.value
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <Loading text="Loading orders..." />
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <ShoppingBag className="w-20 h-20 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No orders found
          </h3>
          <p className="text-gray-600 mb-6">
            {filterStatus === 'all'
              ? "You haven't placed any orders yet"
              : `No ${filterStatus} orders found`}
          </p>
          <Link href="/products">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <Package className="w-6 h-6 text-primary-600" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {ORDER_STATUS.find((s) => s.value === order.orderStatus)
                      ?.label || order.orderStatus}
                  </span>
                  <Link href={`/orders/${order._id}`}>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4">
                <div className="space-y-3">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {typeof item.product === 'object' &&
                        item.product.images ? (
                          <img
                            src={
                              item.product.images[0] ||
                              '/placeholder-product.jpg'
                            }
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium text-gray-900">
                          {typeof item.product === 'object'
                            ? item.product.name
                            : 'Product'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity} • {formatCurrency(item.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-sm text-gray-600 text-center pt-2">
                      +{order.items.length - 3} more item(s)
                    </p>
                  )}
                </div>
              </div>

              {/* Order Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Payment:</span>{' '}
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
                  </p>
                  <p>
                    <span className="font-medium">Delivery to:</span>{' '}
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {formatCurrency(order.totalAmount)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State for Filtered Results */}
      {!loading && orders.length === 0 && filterStatus !== 'all' && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No orders with status "{filterStatus}" found
          </p>
          <button
            onClick={() => setFilterStatus('all')}
            className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
          >
            View all orders
          </button>
        </div>
      )}
    </div>
  );
}