export const APP_NAME = 'Praja Collections';
export const APP_DESCRIPTION = 'Your one-stop shop for quality products';

export const CATEGORIES = [
  { name: 'Men', slug: 'men' },
  { name: 'Women', slug: 'women' },
  { name: 'Kids', slug: 'kids' },
  { name: 'Accessories', slug: 'accessories' },
  { name: 'Footwear', slug: 'footwear' },
];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Yellow', value: '#F59E0B' },
];

export const ORDER_STATUS = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'processing', label: 'Processing', color: 'blue' },
  { value: 'shipped', label: 'Shipped', color: 'purple' },
  { value: 'delivered', label: 'Delivered', color: 'green' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' },
];

export const PAYMENT_STATUS = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'completed', label: 'Completed', color: 'green' },
  { value: 'failed', label: 'Failed', color: 'red' },
];

export const ITEMS_PER_PAGE = 12;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];