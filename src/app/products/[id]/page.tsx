'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, Heart, Truck, Shield, RefreshCw, ChevronLeft, Plus, Minus, Tag } from 'lucide-react';
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
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setProduct(data.product);
        if (data.product.sizes?.length > 0) setSelectedSize(data.product.sizes[0]);
        if (data.product.colors?.length > 0) setSelectedColor(data.product.colors[0]);
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
    if (product.stock === 0) { toast.error('Product is out of stock'); return; }
    if (quantity > product.stock) { toast.error(`Only ${product.stock} items available`); return; }
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

  if (loading) return <Loading text="Loading product..." />;

  if (!product) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-900">Product not found</h2>
          <button onClick={() => router.push('/products')} className="mt-4 text-amber-600 font-semibold hover:underline">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const discount = product.discountPrice ? calculateDiscount(product.price, product.discountPrice) : 0;

  return (
    <div
      className="min-h-screen bg-stone-50"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      {/* Breadcrumb */}
      <div className="bg-white border-b border-stone-200">
        <div className="container mx-auto px-4 py-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-black hover:text-stone-900 text-sm font-medium transition-colors duration-150"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Products
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* ── Left: Images ── */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-stone-100 rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
              <Image
                src={product.images[selectedImage] || '/placeholder-product.jpg'}
                alt={product.name || 'Product image'}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  {discount}% OFF
                </div>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center rounded-2xl">
                  <span className="bg-white text-stone-900 font-bold text-lg px-6 py-2 rounded-xl shadow">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square bg-stone-100 rounded-xl overflow-hidden border-2 transition-all duration-150 ${selectedImage === index
                      ? 'border-amber-500 shadow-md'
                      : 'border-stone-200 hover:border-stone-400'
                      }`}
                  >
                    <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Info ── */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8 space-y-6">

            {/* Title & Category */}
            <div>
              <span className="text-amber-600 text-xs font-bold uppercase tracking-widest">
                {product.category}
              </span>
              <h1
                className="text-3xl font-bold text-stone-900 mt-1 leading-tight"
                style={{ letterSpacing: '-0.02em' }}
              >
                {product.name}
              </h1>
            </div>

            {/* Price Block */}
            <div className="flex flex-wrap items-end gap-3 pb-6 border-b border-stone-100">
              <span className="text-4xl font-bold text-stone-900">
                {formatCurrency(product.discountPrice || product.price)}
              </span>
              {product.discountPrice && (
                <>
                  <span className="text-xl text-black line-through font-medium">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-lg text-sm font-bold">
                    Save {formatCurrency(product.price - product.discountPrice)}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-black text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-stone-900 font-bold text-sm mb-3">
                  Size
                  <span className="ml-2 text-amber-600 font-semibold">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all duration-150 ${selectedSize === size
                        ? 'border-stone-900 bg-stone-900 text-white shadow-md'
                        : 'border-stone-200 text-stone-700 hover:border-stone-400 bg-white'
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
              <div>
                <label className="block text-stone-900 font-bold text-sm mb-3">
                  Color
                  <span className="ml-2 text-amber-600 font-semibold">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all duration-150 ${selectedColor === color
                        ? 'border-stone-900 bg-stone-900 text-white shadow-md'
                        : 'border-stone-200 text-stone-700 hover:border-stone-400 bg-white'
                        }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-stone-900 font-bold text-sm mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-stone-100 border border-stone-200 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-stone-900 hover:text-white text-stone-700 transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                  <span className="w-10 text-center text-base font-bold text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-stone-900 hover:text-white text-stone-700 transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>
                <span className={`text-sm font-semibold ${product.stock <= 5 ? 'text-red-500' : 'text-black'}`}>
                  {product.stock <= 5 ? `Only ${product.stock} left!` : `${product.stock} in stock`}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-200 disabled:text-black disabled:cursor-not-allowed text-stone-900 font-bold text-base rounded-xl transition-colors duration-200 shadow-md"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                onClick={() => setWishlisted((w) => !w)}
                className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 transition-colors duration-150 ${wishlisted
                  ? 'bg-red-50 border-red-300 text-red-500'
                  : 'bg-white border-stone-200 text-black hover:border-red-300 hover:text-red-400'
                  }`}
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Trust Features */}
            <div className="border-t border-stone-100 pt-6 grid grid-cols-3 gap-4">
              {[
                { icon: Truck, title: 'Free Delivery', desc: 'Orders above ₹999' },
                { icon: RefreshCw, title: 'Easy Returns', desc: '7-day policy' },
                { icon: Shield, title: 'Secure Pay', desc: '100% safe' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-amber-600" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-stone-900 font-bold text-xs">{title}</p>
                    <p className="text-black text-xs mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}