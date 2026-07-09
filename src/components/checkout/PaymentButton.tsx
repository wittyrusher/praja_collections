'use client';

import React, { useState } from 'react';
import { CreditCard, Truck, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

interface PaymentButtonProps {
  amount: number;
  // Razorpay success passes paymentId, razorpayOrderId, signature up to parent
  onPaymentSuccess: (paymentId: string, razorpayOrderId: string, signature: string) => void;
  // COD places order directly in parent
  onCOD: () => void;
  disabled?: boolean;
}

declare global {
  interface Window { Razorpay: any; }
}

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function PaymentButton({
  amount,
  onPaymentSuccess,
  onCOD,
  disabled,
}: PaymentButtonProps) {
  const [isRazorpayLoading, setIsRazorpayLoading] = useState(false);
  const [isCODLoading, setIsCODLoading] = useState(false);

  const handleRazorpay = async () => {
    try {
      setIsRazorpayLoading(true);

      // Create Razorpay order on server
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Failed to initialise payment');

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) throw new Error('Razorpay SDK failed to load. Are you online?');
      if (!window.Razorpay) throw new Error('Razorpay SDK not loaded');

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Praja Collections',
        description: 'Order Payment',
        order_id: data.orderId,
        handler: function (response: any) {
          // Payment succeeded — pass details up; parent will create order + verify
          onPaymentSuccess(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature,
          );
        },
        theme: { color: '#F59E0B' },
        modal: {
          ondismiss: () => {
            setIsRazorpayLoading(false);
            toast.error('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response: any) => {
        setIsRazorpayLoading(false);
        toast.error('Payment failed: ' + response.error.description);
      });
      razorpay.open();
    } catch (error: any) {
      setIsRazorpayLoading(false);
      toast.error(error.message || 'Payment initialisation failed');
    }
  };

  const handleCOD = async () => {
    setIsCODLoading(true);
    try {
      await onCOD();
    } finally {
      setIsCODLoading(false);
    }
  };

  const busy = disabled || isRazorpayLoading || isCODLoading;

  return (
    <div className="space-y-3">

      {/* Razorpay — Pay Now */}
      <button
        onClick={handleRazorpay}
        disabled={busy}
        className="w-full h-13 flex items-center justify-between gap-3 px-5 py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-stone-900 font-bold rounded-xl transition-colors duration-200 active:scale-[0.98]"
      >
        <div className="flex items-center gap-2.5">
          {isRazorpayLoading ? (
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : (
            <CreditCard className="w-5 h-5" />
          )}
          <span className="text-base">
            {isRazorpayLoading ? 'Opening payment…' : 'Pay now'}
          </span>
        </div>
        <span className="text-base font-extrabold">
          ₹{Math.round(amount).toLocaleString('en-IN')}
        </span>
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-stone-800" />
        <span className="text-xs text-stone-500 font-medium">or</span>
        <div className="flex-1 h-px bg-stone-800" />
      </div>

      {/* COD */}
      <button
        onClick={handleCOD}
        disabled={busy}
        className="w-full h-13 flex items-center justify-between gap-3 px-5 py-4 bg-stone-800 hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl border border-stone-700 transition-colors duration-200 active:scale-[0.98]"
      >
        <div className="flex items-center gap-2.5">
          {isCODLoading ? (
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : (
            <Truck className="w-5 h-5 text-stone-400" />
          )}
          <div className="text-left">
            <p className="text-sm font-bold leading-tight">
              {isCODLoading ? 'Placing order…' : 'Cash on delivery'}
            </p>
            <p className="text-xs text-stone-400 font-normal mt-0.5">Pay when your order arrives</p>
          </div>
        </div>
        <span className="text-sm font-bold text-stone-300">
          ₹{Math.round(amount).toLocaleString('en-IN')}
        </span>
      </button>

      {/* Trust note */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-stone-500 pt-1">
        <ShieldCheck className="w-3.5 h-3.5" />
        All payments are encrypted and secure
      </div>
    </div>
  );
}