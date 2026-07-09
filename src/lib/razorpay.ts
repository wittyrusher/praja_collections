import Razorpay from 'razorpay';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'your_razorpay_key_id';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_key_secret';

export const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

export { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET };