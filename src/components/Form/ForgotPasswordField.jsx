import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Mail } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

function ForgotPasswordField({ onBack }) {
  const [email, setemail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const forgotPasswordResponse = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/reset-password-token`, { email }, { withCredentials: true })
      if (forgotPasswordResponse.status === 200) {
        toast.success("Password Reset Email Sent")
        setLoading(false)
        setemail("")
        onBack()
      } else {
        toast.error("check your email, or wait a while")
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
    }

  };

  if (success) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Check Your Email
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            We've sent password reset instructions to your email address
          </p>
        </div>

        <div className="text-green-600 dark:text-green-400 text-sm p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg animate-in slide-in-from-top-2 duration-200 mb-6">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Password reset email sent successfully!
          </div>
        </div>

        <div className="flex justify-start">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 cursor-pointer"
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Reset Password
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Enter your email address or username and we'll send you instructions to reset your password
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </Label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 h-4 w-4 transition-colors duration-200" />
            <Input
              className="pl-10 h-11 transition-all duration-200"
              type="text"
              id="email"
              placeholder="Enter your email address "
              value={email}
              onChange={(e) => setemail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-11 font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          disabled={loading || !email.trim()}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending...</span>
            </div>
          ) : (
            <span className="text-base">Send Reset Instructions</span>
          )}
        </Button>
      </form>

      {/* Back to Login Link */}
      <div className="mt-6 flex justify-start">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 cursor-pointer"
        >
          Back to login
        </button>
      </div>

      {/* Additional Help */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Still having trouble?{" "}
          <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordField;