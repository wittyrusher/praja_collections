'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Upload, X, ArrowLeft } from 'lucide-react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Loading from '../../../components/ui/Loading';
import { CATEGORIES, SIZES, COLORS } from '../../../utils/constants';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  category: string;
  images: string[];
  stock: string;
  sizes: string[];
  colors: string[];
  featured: boolean;
}

export default function AddProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const isEditMode = !!productId;

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: CATEGORIES[0].slug,
    images: [],
    stock: '',
    sizes: [],
    colors: [],
    featured: false,
  });

  const [imageInput, setImageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      if (session?.user?.role !== 'admin') {
        router.push('/');
      } else if (isEditMode) {
        fetchProduct();
      }
    }
  }, [status, session, productId]);

  const fetchProduct = async () => {
    setFetchingProduct(true);
    try {
      const res = await fetch(`/api/products/${productId}`);
      const data = await res.json();

      if (data.success) {
        const product = data.product;
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          discountPrice: product.discountPrice?.toString() || '',
          category: product.category,
          images: product.images,
          stock: product.stock.toString(),
          sizes: product.sizes || [],
          colors: product.colors || [],
          featured: product.featured,
        });
      } else {
        toast.error('Product not found');
        router.push('/admin/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
    } finally {
      setFetchingProduct(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddImage = () => {
    if (!imageInput.trim()) {
      toast.error('Please enter an image URL');
      return;
    }

    if (!imageInput.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i)) {
      toast.error('Please enter a valid image URL');
      return;
    }

    if (formData.images.includes(imageInput)) {
      toast.error('Image already added');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageInput],
    }));
    setImageInput('');
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSizeToggle = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleColorToggle = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const validate = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (
      formData.discountPrice &&
      parseFloat(formData.discountPrice) >= parseFloat(formData.price)
    ) {
      newErrors.discountPrice = 'Discount price must be less than price';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice
          ? parseFloat(formData.discountPrice)
          : undefined,
        category: formData.category,
        images: formData.images,
        stock: parseInt(formData.stock),
        sizes: formData.sizes,
        colors: formData.colors,
        featured: formData.featured,
      };

      const url = isEditMode
        ? `/api/products/${productId}`
        : '/api/products';
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(
          isEditMode
            ? 'Product updated successfully'
            : 'Product added successfully'
        );
        router.push('/admin/products');
      } else {
        toast.error(data.error || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || fetchingProduct) {
    return <Loading text="Loading..." />;
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <Link
        href="/admin/products"
        className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="text-gray-600">
          {isEditMode
            ? 'Update product details below'
            : 'Fill in the product details below'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Basic Information
          </h2>

          <div className="space-y-4">
            <Input
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="e.g., Cotton T-Shirt"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Detailed product description..."
                required
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Pricing & Inventory
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Price (₹)"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              error={errors.price}
              placeholder="1999"
              required
            />

            <Input
              label="Discount Price (₹)"
              name="discountPrice"
              type="number"
              step="0.01"
              value={formData.discountPrice}
              onChange={handleChange}
              error={errors.discountPrice}
              placeholder="1499 (optional)"
            />

            <Input
              label="Stock Quantity"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              error={errors.stock}
              placeholder="100"
              required
            />
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Product Images
          </h2>

          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                label=""
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder="Enter image URL (https://...)"
                className="flex-grow"
              />
              <Button
                type="button"
                onClick={handleAddImage}
                variant="secondary"
                className="mt-0"
              >
                <Upload className="w-5 h-5 mr-2" />
                Add
              </Button>
            </div>

            {errors.images && (
              <p className="text-sm text-red-600">{errors.images}</p>
            )}

            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            <p className="text-sm text-gray-600">
              💡 Tip: Use high-quality images. First image will be the primary
              display image.
            </p>
          </div>
        </div>

        {/* Sizes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Available Sizes
          </h2>

          <div className="flex flex-wrap gap-3">
            {SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeToggle(size)}
                className={`px-4 py-2 border-2 rounded-lg font-medium transition ${
                  formData.sizes.includes(size)
                    ? 'border-primary-600 bg-primary-50 text-primary-600'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Select applicable sizes for this product
          </p>
        </div>

        {/* Colors */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Available Colors
          </h2>

          <div className="flex flex-wrap gap-3">
            {COLORS.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => handleColorToggle(color.name)}
                className={`px-4 py-2 border-2 rounded-lg font-medium transition ${
                  formData.colors.includes(color.name)
                    ? 'border-primary-600 bg-primary-50 text-primary-600'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <span
                  className="inline-block w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: color.value }}
                ></span>
                {color.name}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Select available colors for this product
          </p>
        </div>

        {/* Additional Options */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Additional Options
          </h2>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-5 h-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <div>
              <span className="font-medium text-gray-900">
                Featured Product
              </span>
              <p className="text-sm text-gray-600">
                Display this product on the home page
              </p>
            </div>
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-4">
          <Button
            type="submit"
            isLoading={loading}
            className="flex-1"
          >
            {isEditMode ? 'Update Product' : 'Add Product'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/products')}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}