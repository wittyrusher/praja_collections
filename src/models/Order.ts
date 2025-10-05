import mongoose, { Schema, models } from 'mongoose';
import { IOrder } from '../types/order';

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: String,
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        size: String,
        color: String,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
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
      razorpayOrderId: { type: String, required: true },
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
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Order = models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;