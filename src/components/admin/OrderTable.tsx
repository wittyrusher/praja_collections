'use client';

import React from 'react';
import { Eye } from 'lucide-react';
import { IOrder } from '../../types/order';
import { formatCurrency, formatDate } from '../../utils/helpers';
import Button from '../ui/Button';
import { ORDER_STATUS } from '../../utils/constants';

interface OrderTableProps {
  orders: IOrder[];
  onView: (order: IOrder) => void;
  onStatusChange: (orderId: string, newStatus: string) => void;
}

export default function OrderTable({
  orders,
  onView,
  onStatusChange,
}: OrderTableProps) {
  const getStatusColor = (status: string) => {
    const statusObj = ORDER_STATUS.find((s) => s.value === status);
    return statusObj?.color || 'gray';
  };

  const getStatusClass = (color: string) => {
    const colors: any = {
      yellow: 'bg-yellow-100 text-yellow-800',
      blue: 'bg-white-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
    };
    return colors[color] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Date
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Total
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Payment
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Status
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <span className="text-sm font-mono text-gray-900">
                  #{order._id.slice(-8).toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm">
                  <div className="font-medium text-gray-900">
                    {order.shippingAddress.name}
                  </div>
                  <div className="text-gray-500">{order.shippingAddress.phone}</div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-600">
                  {formatDate(order.createdAt)}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(order.totalAmount)}
                </span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.paymentInfo.paymentStatus === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : order.paymentInfo.paymentStatus === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {order.paymentInfo.paymentStatus}
                </span>
              </td>
              <td className="px-6 py-4">
                <select
                  value={order.orderStatus}
                  onChange={(e) => onStatusChange(order._id, e.target.value)}
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusClass(
                    getStatusColor(order.orderStatus)
                  )}`}
                >
                  {ORDER_STATUS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-6 py-4 text-right">
                <Button size="sm" variant="secondary" onClick={() => onView(order)}>
                  <Eye className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {orders.length === 0 && (
        <div className="text-center py-12 text-gray-500">No orders found</div>
      )}
    </div>
  );
}