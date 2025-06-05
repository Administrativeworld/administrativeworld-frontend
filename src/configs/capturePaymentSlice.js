import { toast } from "react-hot-toast"

import rzpLogo from "../../public/android-chrome-192x192.png"

import { paymentApi } from "../redux/api/pyamentApi"
import axios from "axios"

const COURSE_PAYMENT_API = `${import.meta.env.VITE_BASE_URL}/payment/capturePayment`
const COURSE_VERIFY_API = `${import.meta.env.VITE_BASE_URL}/payment/verifyPayment`
const SEND_PAYMENT_SUCCESS_EMAIL_API = `${import.meta.env.VITE_BASE_URL}/payment/sendPaymentSuccessEmail`

// Load the Razorpay SDK from the CDN
function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = src
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

// Buy the Course
// Buy the Course
export async function BuyCourse(
  token,
  courseId,
  user_details,
  navigate,
  dispatch
) {
  const toastId = toast.loading("Loading...")
  try {
    // Loading the script of Razorpay SDK
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

    if (!res) {
      toast.error(
        "Razorpay SDK failed to load. Check your Internet Connection."
      )
      return
    }

    // Initiating the Order in Backend with courseId
    const orderResponse = await axios.post(COURSE_PAYMENT_API, { courseId: courseId }, { withCredentials: true })
    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message)
    }
    console.log("PAYMENT RESPONSE FROM BACKEND............", orderResponse.data)

    // Opening the Razorpay SDK
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      currency: orderResponse.data.data.currency,
      amount: `${orderResponse.data.data.amount}`,
      order_id: orderResponse.data.data.id,
      name: "Administrative World",
      description: "Thank you for Purchasing the Course.",
      image: rzpLogo,
      prefill: {
        name: `${user_details.firstName} ${user_details.lastName}`,
        email: user_details.email,
      },
      handler: function (response) {
        sendPaymentSuccessEmail(response, orderResponse.data.data.amount, token)
        verifyPayment({ ...response, courseId }, token, navigate, dispatch) // pass courseId instead of courses
      },
    }
    const paymentObject = new window.Razorpay(options)

    paymentObject.open()
    paymentObject.on("payment.failed", function (response) {
      toast.error("Oops! Payment Failed.")
      console.log(response.error)
    })
  } catch (error) {
    console.log("PAYMENT API ERROR............", error)
    toast.error("Could Not make Payment.")
  }
  toast.dismiss(toastId)
}


// Verify the Payment
async function verifyPayment(bodyData, navigate, courseId) {
  const toastId = toast.loading("Verifying Payment...")
  // dispatch(setPaymentLoading(true))
  try {

    const response = await axios.post(COURSE_VERIFY_API, bodyData, {
      withCredentials: true
    })
    console.log("VERIFY PAYMENT RESPONSE FROM BACKEND............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Payment Successful. You are Added to the course ")
    navigate(`/home/enrolled?id=${bodyData.courseId}`)
    // dispatch(resetCart())
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR............", error)
    toast.error("Could Not Verify Payment.")
  }
  toast.dismiss(toastId)
  // dispatch(setPaymentLoading(false))
}

// Send the Payment Success Email
async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await paymentApi(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )
  } catch (error) {
    console.log("PAYMENT SUCCESS EMAIL ERROR............", error)
  }
}