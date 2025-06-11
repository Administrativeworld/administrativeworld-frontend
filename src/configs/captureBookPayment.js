// Razorpay Payment Functions
// Import these functions and use them in your components

import axios from 'axios';

// Load Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Main payment function - call this on button click
export const initiateBookPurchase = async ({
  bookId,
  bookTitle,
  bookPrice,
  userDetails = {},
  onSuccess = () => { },
  onError = () => { },
  onLoading = () => { }
}) => {
  try {
    onLoading(true);

    // Step 1: Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error('Razorpay SDK failed to load');
    }

    // Step 2: Create payment order
    const orderData = await createPaymentOrder({
      bookId
    });

    // Step 3: Configure and open Razorpay
    await openRazorpayCheckout({
      orderData,
      bookId,
      bookTitle,
      bookPrice,
      userDetails,
      onSuccess,
      onError,
      onLoading
    });

  } catch (error) {
    console.error('Payment initiation failed:', error);
    onError(error.response?.data?.message || error.message || 'Payment initiation failed');
    onLoading(false);
  }
};

// Create payment order (calls your captureBookPayment controller)
const createPaymentOrder = async ({ bookId }) => {
  const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/store/capture`,
    { bookId },
    {
      withCredentials: true, headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to create payment order');
  }

  return response.data.data;
};

// Open Razorpay checkout modal
const openRazorpayCheckout = async ({
  orderData,
  bookId,
  bookTitle,
  bookPrice,
  userDetails,
  onSuccess,
  onError,
  onLoading
}) => {
  console.log(orderData)
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY, // Your Razorpay key
    amount: orderData.amount,
    currency: orderData.currency,
    name: 'BookStore',
    description: `Purchase: ${bookTitle}`,
    order_id: orderData.id,

    // Payment success handler
    handler: async function (response) {
      await verifyPayment({
        paymentResponse: response,
        bookId,
        onSuccess,
        onError,
        onLoading
      });
    },

    // User prefill data
    prefill: {
      name: userDetails.name || '',
      email: userDetails.email || '',
      contact: userDetails.phone || ''
    },

    // Theme customization
    theme: {
      color: '#3B82F6'
    },

    // Modal settings
    modal: {
      ondismiss: function () {
        onLoading(false);
        onError('Payment cancelled by user');
      }
    }
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};

// Verify payment (calls your verifyBookPayment controller)
const verifyPayment = async ({
  paymentResponse,
  bookId,
  onSuccess,
  onError,
  onLoading
}) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/store/verify`,
      {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        bookId
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.success) {
      onSuccess('Purchase successful! Check your email for confirmation.');
    } else {
      throw new Error(response.data.message || 'Payment verification failed');
    }
  } catch (error) {
    console.error('Payment verification failed:', error);
    onError(error.response?.data?.message || error.message || 'Payment verification failed');
  } finally {
    onLoading(false);
  }
};

// Alternative: Simple one-liner function for basic usage
export const buyBook = (bookId, bookTitle, bookPrice) => {
  return initiateBookPurchase({
    bookId,
    bookTitle,
    bookPrice,
    onSuccess: (message) => alert(message),
    onError: (error) => alert(`Error: ${error}`),
    onLoading: (loading) => console.log('Loading:', loading)
  });
};