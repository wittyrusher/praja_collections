'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
} from 'lucide-react';
import Loading from '@/components/ui/Loading';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/utils/helpers';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: any[];
  lowStockProducts: any[];
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: [],
    lowStockProducts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'admin') {
        router.push('/');
      } else {
        fetchDashboardData();
      }
    }
  }, [status, session]);

  const fetchDashboardData = async () => {
    try {
      const ordersRes = await fetch('/api/orders');
      const ordersData = await ordersRes.json();

      const productsRes = await fetch('/api/products?limit=100');
      const productsData = await productsRes.json();

      if (ordersData.success && productsData.success) {
        const orders = ordersData.orders;
        const products = productsData.products;

        const totalRevenue = orders
          .filter((order: any) => order.paymentInfo.paymentStatus === 'completed')
          .reduce((sum: number, order: any) => sum + order.totalAmount, 0);

        const lowStockProducts = products.filter(
          (product: any) => product.stock < 10
        );

        setStats({
          totalOrders: orders.length,
          totalRevenue,
          totalProducts: products.length,
          totalUsers: 0,
          recentOrders: orders.slice(0, 5),
          lowStockProducts: lowStockProducts.slice(0, 5),
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return <Loading text="Loading dashboard..." />;
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'bg-green-500',
      trend: '+12.5%',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: 'bg-white-500',
      trend: '+8.2%',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toString(),
      icon: Package,
      color: 'bg-purple-500',
      trend: '+3.1%',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers.toString(),
      icon: Users,
      color: 'bg-orange-500',
      trend: '+5.7%',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Welcome back, {session.user.name}!</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Link href="/admin/add-product">
            <Button>
              <Plus className="w-5 h-5 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg bg-opacity-10`}>
                <stat.icon
                  className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`}
                />
              </div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                {stat.trend}
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              {stat.title}
            </h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All →
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-900">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.orderStatus === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.orderStatus === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-white-100 text-blue-800'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Low Stock Alert</h2>
            <Link
              href="/admin/products"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All →
            </Link>
          </div>

          {stats.lowStockProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              All products are well stocked
            </p>
          ) : (
            <div className="space-y-4">
              {stats.lowStockProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center space-x-3 flex-grow">
                    <div className="relative w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={product.images[0] || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 line-clamp-1">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-sm font-bold ${
                        product.stock === 0 ? 'text-red-600' : 'text-yellow-600'
                      }`}
                    >
                      {product.stock === 0
                        ? 'Out of Stock'
                        : `${product.stock} left`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/products"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <Package className="w-10 h-10 text-primary-600 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Manage Products
          </h3>
          <p className="text-gray-600 text-sm">
            Add, edit, or remove products from your store
          </p>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <ShoppingCart className="w-10 h-10 text-primary-600 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Manage Orders
          </h3>
          <p className="text-gray-600 text-sm">
            View and update order status and details
          </p>
        </Link>

        <Link
          href="/admin/add-product"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <Plus className="w-10 h-10 text-primary-600 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Add New Product
          </h3>
          <p className="text-gray-600 text-sm">
            Add new products to your inventory
          </p>
        </Link>
      </div>
    </div>
  );
}