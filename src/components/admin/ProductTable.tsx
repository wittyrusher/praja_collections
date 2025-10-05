'use client';

import React from 'react';
import Image from 'next/image';
import { Edit, Trash2 } from 'lucide-react';
import { IProduct } from '../../types/product';
import { formatCurrency } from '../../utils/helpers';
import Button from '../ui/Button';

interface ProductTableProps {
  products: IProduct[];
  onEdit: (product: IProduct) => void;
  onDelete: (id: string) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Image
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Category
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Price
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Stock
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
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={product.images[0] || '/placeholder-product.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900">{product.name}</div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-600">{product.category}</span>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(product.discountPrice || product.price)}
                  </div>
                  {product.discountPrice && (
                    <div className="text-gray-500 line-through">
                      {formatCurrency(product.price)}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`text-sm font-medium ${
                    product.stock === 0
                      ? 'text-red-600'
                      : product.stock < 10
                      ? 'text-yellow-600'
                      : 'text-green-600'
                  }`}
                >
                  {product.stock}
                </span>
              </td>
              <td className="px-6 py-4">
                {product.featured && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    Featured
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onEdit(product)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => onDelete(product._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {products.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No products found
        </div>
      )}
    </div>
  );
}