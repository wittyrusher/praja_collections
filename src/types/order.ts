import { IProduct } from './product';

export interface IOrder {
  _id: string;
  userId: string;
  items: IOrderItem[];
  totalAmount: number;
  shippingAddress: IShippingAddress;
  paymentInfo: IPaymentInfo;
  orderStatus: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  product: IProduct | string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

export interface IShippingAddress {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface IPaymentInfo {
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentStatus: PaymentStatus;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'completed' | 'failed';

export interface CreateOrderInput {
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
}