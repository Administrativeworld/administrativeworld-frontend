import { toast } from "react-hot-toast";
import axios from "axios";
import rzpLogo from "../../public/android-chrome-192x192.png";

// API endpoints
const BASE_URL = import.meta.env.VITE_BASE_URL;
const PAYMENT_ENDPOINTS = {
  CAPTURE: `${BASE_URL}/payment/capturePayment`,
  VERIFY: `${BASE_URL}/payment/verifyPayment`
};

// Load Razorpay SDK
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Main function to buy course
export async function buyCourse(courseId, userDetails, navigate, couponCode = null) {
  const toastId = toast.loading("Processing payment...");

  try {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Payment gateway failed to load.");
      return;
    }

    const orderResponse = await createPaymentOrder(courseId, couponCode);

    const razorpayOptions = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: orderResponse.amount,
      currency: orderResponse.currency,
      order_id: orderResponse.id,
      name: "Administrative World",
      description: "Course Purchase",
      image: rzpLogo,
      prefill: {
        name: `${userDetails.firstName} ${userDetails.lastName}`,
        email: userDetails.email,
      },
      handler: (response) => handlePaymentSuccess(response, courseId, navigate),
      modal: {
        ondismiss: () => {
          toast.error("Payment cancelled");
        }
      }
    };

    const paymentObject = new window.Razorpay(razorpayOptions);
    paymentObject.open();

    paymentObject.on("payment.failed", (response) => {
      console.error("Payment failed:", response.error);
      toast.error("Payment failed. Please try again.");
    });

  } catch (error) {
    console.error("Payment initiation error:", error);
    toast.error(error.message || "Failed to initiate payment");
  } finally {
    toast.dismiss(toastId);
  }
}

// Create payment order (now accepts couponCode)
async function createPaymentOrder(courseId, couponCode = null) {
  try {
    const payload = { courseId };
    if (couponCode) payload.couponCode = couponCode;

    const response = await axios.post(PAYMENT_ENDPOINTS.CAPTURE, payload, { withCredentials: true });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create payment order");
  }
}

// Handle successful payment
async function handlePaymentSuccess(paymentResponse, courseId, navigate) {
  const toastId = toast.loading("Verifying payment...");

  try {
    await verifyPaymentAndEnroll(paymentResponse, courseId);
    toast.success("Payment successful! You're enrolled.");
    navigate(`/home/enrolled?id=${courseId}`);
  } catch (error) {
    console.error("Payment verification error:", error);
    toast.error("Verification failed. Please contact support.");
  } finally {
    toast.dismiss(toastId);
  }
}

// Verify payment and enroll student
async function verifyPaymentAndEnroll(paymentResponse, courseId) {
  try {
    const verificationData = {
      razorpay_order_id: paymentResponse.razorpay_order_id,
      razorpay_payment_id: paymentResponse.razorpay_payment_id,
      razorpay_signature: paymentResponse.razorpay_signature,
      courseId
    };

    const response = await axios.post(PAYMENT_ENDPOINTS.VERIFY, verificationData, { withCredentials: true });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Payment verification failed");
  }
}
