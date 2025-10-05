'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import ProductTable from '../../../components/admin/ProductTable';
import Loading from '../../../components/ui/Loading';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { IProduct } from '../../../types/product';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'admin') {
        router.push('/');
      } else {
        fetchProducts();
      }
    }
  }, [status, session]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products?limit=100');
      const data = await res.json();

      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: IProduct) => {
    router.push(`/admin/add-product?id=${product._id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Product deleted successfully');
        fetchProducts();
      } else {
        toast.error(data.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === 'loading' || loading) {
    return <Loading text="Loading products..." />;
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manage Products
          </h1>
          <p className="text-gray-600">
            Total Products: {filteredProducts.length}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/admin/add-product">
            <Button>
              <Plus className="w-5 h-5 mr-2" />
              Add New Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Products Table */}
      <ProductTable
        products={filteredProducts}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}