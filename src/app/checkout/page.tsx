'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCart } from '../../context/CartContext';
import CheckoutForm from '../../components/checkout/CheckoutForm';
import PaymentButton from '../../components/checkout/PaymentButton';
import { IShippingAddress } from '../../types/order';
import { formatCurrency } from '../../utils/helpers';
import Loading from '../../components/ui/Loading';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const [shippingAddress, setShippingAddress] = useState<IShippingAddress | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [razorpayOrderId, setRazorpayOrderId] = useState<string | null>(null);

  if (status === 'loading') {
    return <Loading text="Loading..." />;
  }

  if (!session) {
    router.push('/login?redirect=/checkout');
    return null;
  }

  if (cart.items.length === 0) {
    router.push('/cart');
    return null;
  }

  const subtotal = cart.totalPrice;
  const shipping = subtotal > 999 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const handleAddressSubmit = async (address: IShippingAddress) => {
    setShippingAddress(address);
    setIsCreatingOrder(true);

    try {
      // Create order in database
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.items.map((item) => ({
            product: item.productId,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color,
          })),
          shippingAddress: address,
          razorpayOrderId: 'temp_' + Date.now(), // Temporary, will be updated
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create order');
      }

      setOrderId(data.order._id);
      toast.success('Order created! Proceed to payment');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create order');
      setShippingAddress(null);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handlePaymentSuccess = async (paymentId: string, signature: string) => {
    try {
      // Verify payment
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpayOrderId,
          razorpayPaymentId: paymentId,
          razorpaySignature: signature,
          orderId,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Payment verification failed');
      }

      toast.success('Payment successful!');
      clearCart();
      router.push(`/orders/${orderId}`);
    } catch (error: any) {
      toast.error(error.message || 'Payment verification failed');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            {!shippingAddress ? (
              <CheckoutForm
                onSubmit={handleAddressSubmit}
                isLoading={isCreatingOrder}
              />
            ) : (
              <div>
                <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="font-semibold">{shippingAddress.name}</p>
                  <p className="text-gray-600">{shippingAddress.phone}</p>
                  <p className="text-gray-600 mt-2">
                    {shippingAddress.street}, {shippingAddress.city}
                  </p>
                  <p className="text-gray-600">
                    {shippingAddress.state} - {shippingAddress.pincode}
                  </p>
                  <p className="text-gray-600">{shippingAddress.country}</p>
                  <button
                    onClick={() => setShippingAddress(null)}
                    className="text-primary-600 hover:text-primary-700 mt-2 text-sm font-medium"
                  >
                    Change Address
                  </button>
                </div>

                <h2 className="text-xl font-bold mb-4">Payment</h2>
                {orderId && (
                  <PaymentButton
                    amount={total}
                    orderId={orderId}
                    onSuccess={handlePaymentSuccess}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            {/* Cart Items */}
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {cart.items.map((item) => (
                <div key={item.productId} className="flex items-center space-x-3">
                  <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image || '/placeholder-product.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (GST 18%)</span>
                <span className="font-semibold">{formatCurrency(tax)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary-600">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}