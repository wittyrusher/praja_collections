'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCart } from '../../context/CartContext';
import CheckoutForm from '../../components/checkout/CheckoutForm';
import PaymentButton from '../../components/checkout/PaymentButton';
import { IShippingAddress } from '../../types/order';
import { formatCurrency } from '../../utils/helpers';
import Loading from '../../components/ui/Loading';
import toast from 'react-hot-toast';
import { MapPin, CreditCard, Pencil, Tag, Truck, Receipt } from 'lucide-react';

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const [shippingAddress, setShippingAddress] = useState<IShippingAddress | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');

  // ── Guard redirects in useEffect — never call router.push during render ──────
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) { router.push('/login?redirect=/checkout'); return; }
    if (cart.items.length === 0) { router.push('/cart'); return; }
  }, [status, session, cart.items.length, router]);

  // Show loading while session resolves or while redirecting
  const isRedirecting =
    status !== 'loading' && (!session || cart.items.length === 0);

  if (status === 'loading' || isRedirecting) return <Loading text="Loading..." />;

  const subtotal = cart.totalPrice;
  let shipping = subtotal > 999 ? 0 : 50;
  if (appliedCoupon === 'prajafreedel') {
    shipping = 0;
  }
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const handleAddressSubmit = (address: IShippingAddress) => {
    setShippingAddress(address);
  };

  const createDBOrder = async (rpOrderId: string, paymentMethod: 'razorpay' | 'cod') => {
    const res = await fetch('/api/orders', {
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
        shippingAddress,
        paymentMethod,
        razorpayOrderId: rpOrderId,
        couponCode: appliedCoupon,
      }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to create order');
    return data.order._id as string;
  };

  const handlePaymentSuccess = async (
    paymentId: string,
    rpOrderId: string,
    signature: string,
  ) => {
    setIsProcessing(true);
    try {
      const dbOrderId = await createDBOrder(rpOrderId, 'razorpay');
      const verifyRes = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpayOrderId: rpOrderId,
          razorpayPaymentId: paymentId,
          razorpaySignature: signature,
          orderId: dbOrderId,
        }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) throw new Error(verifyData.error || 'Payment verification failed');
      toast.success('Payment successful! Order placed.');
      clearCart();
      router.push(`/orders/${dbOrderId}`);
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCOD = async () => {
    if (!shippingAddress) return;
    setIsProcessing(true);
    try {
      const dbOrderId = await createDBOrder('COD_' + Date.now(), 'cod');
      toast.success('Order placed! Pay on delivery.');
      clearCart();
      router.push(`/orders/${dbOrderId}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950" style={{ fontFamily: "'Georgia', serif" }}>
      <div className="container mx-auto px-4 py-10 max-w-6xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>
            Checkout
          </h1>
          <p className="text-stone-500 text-sm mt-1">Complete your order below</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">

            {!shippingAddress ? (
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-8 h-8 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-amber-400" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Shipping address</h2>
                </div>
                <CheckoutForm onSubmit={handleAddressSubmit} isLoading={false} />
              </div>
            ) : (
              <>
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-white">Shipping address</h2>
                        <p className="text-xs text-emerald-400 mt-0.5">Confirmed</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShippingAddress(null)}
                      className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-400 transition-colors border border-stone-700 hover:border-amber-500/40 px-3 py-1.5 rounded-lg"
                    >
                      <Pencil className="w-3 h-3" />
                      Change
                    </button>
                  </div>
                  <div className="bg-stone-950/60 rounded-xl p-4 border border-stone-800">
                    <p className="font-semibold text-white text-sm">{shippingAddress.name}</p>
                    <p className="text-stone-400 text-sm mt-0.5">{shippingAddress.phone}</p>
                    <p className="text-stone-400 text-sm mt-2 leading-relaxed">
                      {shippingAddress.street}, {shippingAddress.city}<br />
                      {shippingAddress.state} – {shippingAddress.pincode}<br />
                      {shippingAddress.country}
                    </p>
                  </div>
                </div>

                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-8 h-8 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-amber-400" />
                    </div>
                    <h2 className="text-lg font-bold text-white">Choose payment method</h2>
                  </div>

                  <div className="flex items-center gap-2 bg-stone-950/60 border border-stone-800 rounded-xl px-4 py-3 mb-6">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                    <p className="text-sm text-stone-300">
                      Secured by <span className="text-white font-semibold">Razorpay</span>. Your payment info is encrypted and never stored.
                    </p>
                  </div>

                  <PaymentButton
                    amount={total}
                    onPaymentSuccess={handlePaymentSuccess}
                    onCOD={handleCOD}
                    disabled={isProcessing}
                  />
                </div>
              </>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sticky top-24">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 bg-stone-800 rounded-lg flex items-center justify-center">
                  <Receipt className="w-4 h-4 text-stone-400" />
                </div>
                <h2 className="text-base font-bold text-white">Order summary</h2>
              </div>

              <div className="space-y-3 mb-5 max-h-56 overflow-y-auto pr-1">
                {cart.items.map((item) => (
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 bg-stone-800 rounded-xl overflow-hidden flex-shrink-0 border border-stone-700">
                      <img
                        src={item.image || '/placeholder-product.jpg'}
                        alt={item.name || 'Product'}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-stone-900 text-[10px] font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm text-stone-200 font-medium truncate">{item.name}</p>
                      <p className="text-xs text-stone-500 mt-0.5">Qty {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-white flex-shrink-0">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {shipping > 0 && (
                <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2.5 mb-4">
                  <Truck className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <p className="text-xs text-amber-300">
                    Add {formatCurrency(999 - subtotal)} more for free shipping
                  </p>
                </div>
              )}

              {/* Coupon Code Section */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-stone-400" />
                  <span className="text-sm font-semibold text-white">Coupon Code</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toLowerCase())}
                    placeholder="Enter code (e.g. prajafreedel)"
                    disabled={!!appliedCoupon}
                    className="flex-1 bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-amber-500 disabled:opacity-50"
                  />
                  {!appliedCoupon ? (
                    <button
                      onClick={() => {
                        if (couponInput === 'prajafreedel') {
                          setAppliedCoupon(couponInput);
                          toast.success('Free delivery coupon applied!');
                        } else if (couponInput) {
                          toast.error('Invalid coupon code');
                        }
                      }}
                      className="bg-stone-800 hover:bg-stone-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Apply
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setAppliedCoupon('');
                        setCouponInput('');
                        toast.success('Coupon removed');
                      }}
                      className="bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {appliedCoupon === 'prajafreedel' && (
                  <p className="text-xs text-emerald-400 mt-2">✨ Free delivery applied!</p>
                )}
              </div>

              <div className="border-t border-stone-800 pt-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400">Subtotal</span>
                  <span className="text-stone-200 font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" /> Shipping
                  </span>
                  <span className={`font-medium ${shipping === 0 ? 'text-emerald-400' : 'text-stone-200'}`}>
                    {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" /> GST (18%)
                  </span>
                  <span className="text-stone-200 font-medium">{formatCurrency(tax)}</span>
                </div>
                <div className="border-t border-stone-800 pt-3 flex justify-between items-baseline">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-xl font-bold text-amber-400">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}