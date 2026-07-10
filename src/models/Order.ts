import mongoose, { Document, Model } from 'mongoose';

export interface IOrder extends Document {
  userId: string;
  items: Array<{
    product: any;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }>;
  totalAmount: number;
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  paymentInfo: {
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    paymentStatus: 'pending' | 'completed' | 'failed';
  };
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'cancellation_pending';
  discount?: number;
  shipping?: number;
  couponCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new mongoose.Schema<IOrder>(
  {
    userId: { type: String, required: true },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        size: String,
        color: String,
      },
    ],
    totalAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    couponCode: String,
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentInfo: {
      razorpayOrderId: { type: String },          // ← required: false (omit = default)
      razorpayPaymentId: String,
      razorpaySignature: String,
      paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
      },
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'cancellation_pending'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;