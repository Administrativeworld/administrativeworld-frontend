import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { login, clearLoginState } from "@/redux/api/loginSlice";
import { toast } from "react-hot-toast";
import PrimarySpinner from "../Loaders/PrimarySpinner";
import { useNavigate } from "react-router-dom";
import { validateUser } from "@/redux/api/authUserSlice";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginCreds, setLoginCreds] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, status } = useSelector((state) => state.login);

  useEffect(() => {
    if (status === 200) {
      toast.dismiss();
      toast.success("Login successful!");
      dispatch(validateUser());
      dispatch(clearLoginState());
      setLoginCreds({ email: "", password: "" });
      navigate("/home");
    } else if (status && status !== 200) {
      toast.error(`Error: ${status}`);
      dispatch(clearLoginState());
    }
  }, [status, dispatch, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email: loginCreds.email, password: loginCreds.password }));
  };

  const googleAuthUrl = `${import.meta.env.VITE_BASE_URL}/auth/google`;

  const handleGoogleLogin = () => {
    window.location.href = googleAuthUrl;
  };

  const GoogleIcon = () => (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <path
        d="M21.805 10.023h-9.82v3.954h5.753a4.912 4.912 0 01-2.133 3.223v2.678h3.444c2.014-1.85 3.174-4.588 3.174-7.855 0-.65-.065-1.278-.32-1.999z"
        fill="#4285F4"
      />
      <path
        d="M11.985 21.94c2.885 0 5.308-.952 7.078-2.58l-3.444-2.678c-.95.636-2.166 1.03-3.633 1.03-2.79 0-5.156-1.886-6-4.424H2.42v2.783a10.063 10.063 0 009.565 5.87z"
        fill="#34A853"
      />
      <path
        d="M5.985 13.288a6.054 6.054 0 010-3.841V6.665H2.42a10.074 10.074 0 000 10.668l3.565-2.045z"
        fill="#FBBC05"
      />
      <path
        d="M11.985 5.256c1.565 0 2.965.538 4.07 1.595l3.05-3.05C17.284 2.22 14.88 1.22 11.985 1.22a10.065 10.065 0 00-9.565 5.445l3.565 2.784c.798-2.538 3.163-4.193 5.999-4.193z"
        fill="#EA4335"
      />
    </svg>
  );

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Sign in to your account to continue
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
              className="pl-10 h-11 transition-all duration-200 "
              type="email"
              id="email"
              placeholder="Enter your email address"
              value={loginCreds.email}
              onChange={(e) => setLoginCreds({ ...loginCreds, email: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </Label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 h-4 w-4 transition-colors duration-200" />
            <Input
              className="pl-10 pr-10 h-11 transition-all duration-200 bg dark:bg-gray-800 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              value={loginCreds.password}
              onChange={(e) => setLoginCreds({ ...loginCreds, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <a
            href="#"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Forgot your password?
          </a>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Sign In Button */}
        <Button
          type="submit"
          className="w-full h-11  font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <PrimarySpinner />
              <span>Signing in...</span>
            </div>
          ) : (
            <span className="text-base">Sign In</span>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            Or continue with
          </span>
        </div>
      </div>

      {/* Google Sign In Button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        className="w-full h-11 flex items-center justify-center gap-3 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
      >
        <GoogleIcon />
        <span className="font-medium">Sign in with Google</span>
      </Button>

      {/* Additional Help */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Having trouble signing in?{" "}
          <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;