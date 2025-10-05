'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, Heart, Truck, Shield, RefreshCw } from 'lucide-react';
import { IProduct } from '../../../types/product';
import { formatCurrency, calculateDiscount } from '../../../utils/helpers';
import { useCart } from '../../../context/CartContext';
import Button from '../../../components/ui/Button';
import Loading from '../../../components/ui/Loading';
import toast from 'react-hot-toast';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.id}`);
      const data = await res.json();

      if (data.success) {
        setProduct(data.product);
        if (data.product.sizes?.length > 0) {
          setSelectedSize(data.product.sizes[0]);
        }
        if (data.product.colors?.length > 0) {
          setSelectedColor(data.product.colors[0]);
        }
      } else {
        toast.error('Product not found');
        router.push('/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (product.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }

    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available`);
      return;
    }

    addToCart({
      productId: product._id,
      name: product.name,
      price: product.discountPrice || product.price,
      quantity,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      stock: product.stock,
    });
  };

  if (loading) {
    return <Loading text="Loading product..." />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
      </div>
    );
  }

  const discount = product.discountPrice
    ? calculateDiscount(product.price, product.discountPrice)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            <Image
              src={product.images[selectedImage] || '/placeholder-product.jpg'}
              alt={product.name}
              fill
              className="object-cover"
            />
            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-md font-semibold">
                {discount}% OFF
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-primary-600' : ''
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>
          <p className="text-gray-600 mb-4">{product.category}</p>

          {/* Price */}
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-3xl font-bold text-gray-900">
              {formatCurrency(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && (
              <>
                <span className="text-xl text-gray-500 line-through">
                  {formatCurrency(product.price)}
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-md font-semibold">
                  Save {formatCurrency(product.price - product.discountPrice)}
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-6">{product.description}</p>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <label className="block font-semibold mb-2">Select Size</label>
              <div className="flex space-x-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg ${
                      selectedSize === size
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <label className="block font-semibold mb-2">Select Color</label>
              <div className="flex space-x-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-lg ${
                      selectedColor === color
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selection */}
          <div className="mb-6">
            <label className="block font-semibold mb-2">Quantity</label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                -
              </button>
              <span className="text-xl font-semibold w-12 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                +
              </button>
              <span className="text-sm text-gray-600">
                {product.stock} items available
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mb-8">
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline">
              <Heart className="w-5 h-5" />
            </Button>
          </div>

          {/* Features */}
          <div className="border-t pt-6 space-y-4">
            <div className="flex items-center space-x-3">
              <Truck className="w-6 h-6 text-primary-600" />
              <div>
                <p className="font-semibold">Free Delivery</p>
                <p className="text-sm text-gray-600">On orders above ₹999</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <RefreshCw className="w-6 h-6 text-primary-600" />
              <div>
                <p className="font-semibold">Easy Returns</p>
                <p className="text-sm text-gray-600">7-day return policy</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-primary-600" />
              <div>
                <p className="font-semibold">Secure Payment</p>
                <p className="text-sm text-gray-600">100% secure transactions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}