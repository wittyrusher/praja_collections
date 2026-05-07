import Razorpay from 'razorpay';

// Check if keys are provided, use dummy values if not
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret_key';

export const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

export { RAZORPAY_KEY_ID };