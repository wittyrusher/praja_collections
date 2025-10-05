import mongoose, { Schema, models } from 'mongoose';
import { IProduct } from '../types/product';

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    sizes: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });

const Product = models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;