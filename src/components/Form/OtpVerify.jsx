import { useState, useEffect } from "react";
import OtpInput from 'react-otp-input';
import { useDispatch, useSelector } from "react-redux";
import { clearUserCredsData } from "@/redux/global/FormdataSlice";
import { setOtpInput } from "@/redux/global/GlobalVar";
import { Button } from "../ui/button";
import { signup } from "@/redux/api/signupSlice";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import toast from 'react-hot-toast';
import { ArrowLeft, Mail, Shield, Clock } from "lucide-react";
import PrimarySpinner from "../Loaders/PrimarySpinner";

function OtpVerify() {
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const { status } = useSelector(state => state.signup);
  const { userCreds } = useSelector(state => state.formData);
  const [loadingButton, setLoadingButton] = useState(false);

  useEffect(() => {
    if (status === 201) {
      toast.success("Registration successful!");
      dispatch(clearUserCredsData());
    } else if (status && status !== 201) {
      toast.error(`Error: ${status}`);
    }
  }, [status]);

  // Timer for OTP expiration
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otp.length === 6 && !loadingButton) {
      handleSubmit();
    }
  }, [otp, loadingButton]);

  const handleSubmit = async () => {
    try {
      setLoadingButton(true);
      dispatch(signup({ ...userCreds, otp }));
    } catch (error) {
      setLoadingButton(false);
      console.error(error);
    } finally {
      setLoadingButton(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  const handleOtpChange = (value) => {
    // Only allow numeric input and limit to 6 digits
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 6);
    setOtp(numericValue);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleResendOtp = async () => {
    try {
      // Add your resend OTP logic here
      toast.success("OTP resent successfully!");
      setTimeLeft(300); // Reset timer
      setOtp(""); // Clear current OTP
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="text-center px-0 pb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Mail className="w-4 h-4" />
              <span className="font-medium">{userCreds.email}</span>
            </div>
            <p className="text-sm">
              We've sent a 6-digit verification code to your email address.
            </p>
          </CardDescription>
        </CardHeader>

        <CardContent className="px-0">
          <form className="space-y-6" onSubmit={submit}>
            {/* OTP Input */}
            <div className="flex flex-col items-center space-y-4">
              <OtpInput
                inputStyle={{
                  width: "48px",
                  height: "48px",
                  margin: "0 6px",
                  fontSize: "20px",
                  borderRadius: "8px",
                  border: "2px solid #e5e7eb",
                  backgroundColor: "white",
                  color: "#111827",
                  textAlign: "center",
                  outline: "none",
                  transition: "all 0.2s",
                }}
                focusStyle={{
                  border: "2px solid #3b82f6",
                  boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                }}
                value={otp}
                onChange={handleOtpChange}
                numInputs={6}
                renderSeparator={<span className="text-gray-300 mx-1">-</span>}
                renderInput={(props) => <input {...props} />}
                shouldAutoFocus={true}
              />

              {/* Timer */}
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>
                  {timeLeft > 0
                    ? `Code expires in ${formatTime(timeLeft)}`
                    : "Code has expired"
                  }
                </span>
              </div>
            </div>

            {/* Resend OTP */}
            {timeLeft === 0 && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors duration-200"
                >
                  Resend verification code
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-4 pt-4">
              <Button
                type='button'
                variant="outline"
                className="flex-1 h-11 border-gray-300 dark:border-gray-600"
                onClick={() => { dispatch(setOtpInput(false)) }}
                disabled={loadingButton}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {loadingButton ? (
                <Button disabled className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-indigo-600">
                  <PrimarySpinner />
                  <span className="ml-2">Verifying...</span>
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  disabled={otp.length !== 6 || timeLeft === 0}
                >
                  <span>Verify & Register</span>
                </Button>
              )}
            </div>
          </form>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={timeLeft > 0}
                className={`font-medium transition-colors duration-200 ${timeLeft > 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  }`}
              >
                Resend
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default OtpVerify;