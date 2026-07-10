'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PayNowButtonProps {
  orderId: string;
  amount: number;
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

export default function PayNowButton({ orderId, amount }: PayNowButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePayNow = async () => {
    try {
      setLoading(true);

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
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderId: orderId,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              toast.success('Payment successful!');
              router.refresh();
              window.location.reload();
            } else {
              toast.error(verifyData.error || 'Payment verification failed');
            }
          } catch (e: any) {
             toast.error('Payment verification failed');
          }
        },
        theme: { color: '#F59E0B' },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', (response: any) => {
        setLoading(false);
        toast.error('Payment failed: ' + response.error.description);
      });
      razorpay.open();
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message || 'Payment initialisation failed');
    }
  };

  return (
    <button
      onClick={handlePayNow}
      disabled={loading}
      className="mt-3 w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold px-4 py-2 rounded-lg text-sm transition-colors duration-200 active:scale-[0.98] disabled:opacity-50"
    >
      {loading ? (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      ) : (
        <CreditCard className="w-4 h-4" />
      )}
      <span>{loading ? 'Processing...' : 'Pay Now'}</span>
    </button>
  );
}
