'use client';

import React from 'react';
import Button from '../ui/Button';
import { RAZORPAY_KEY_ID } from '../../lib/razorpay';
import toast from 'react-hot-toast';

interface PaymentButtonProps {
  amount: number;
  orderId: string;
  onSuccess: (paymentId: string, signature: string) => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentButton({
  amount,
  orderId,
  onSuccess,
  disabled,
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      // Create Razorpay order
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create order');
      }

      // Check if Razorpay script is loaded
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded');
      }

      // Initialize Razorpay
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'Praja Collections',
        description: 'Order Payment',
        order_id: data.orderId,
        handler: function (response: any) {
          onSuccess(response.razorpay_payment_id, response.razorpay_signature);
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#DC2626',
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
            toast.error('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response: any) {
        setIsLoading(false);
        toast.error('Payment failed: ' + response.error.description);
      });

      razorpay.open();
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message || 'Payment initialization failed');
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || isLoading}
      isLoading={isLoading}
      className="w-full"
    >
      Pay ₹{amount.toLocaleString('en-IN')}
    </Button>
  );
}