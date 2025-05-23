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
import { Mail, Lock } from "lucide-react";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginCreds, setLoginCreds] = useState({ email: "", password: "" });
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
      className="mr-2 h-5 w-5"
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
    <div className="h-full w-full max-w-md mx-auto p-6">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-10 h-12"
              type="email"
              id="email"
              placeholder="Enter your email"
              value={loginCreds.email}
              onChange={(e) => setLoginCreds({ ...loginCreds, email: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-10 h-12"
              type="password"
              id="password"
              placeholder="Enter your password"
              value={loginCreds.password}
              onChange={(e) => setLoginCreds({ ...loginCreds, password: e.target.value })}
              required
            />
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm mt-2 p-2 bg-red-50 border border-red-200 rounded">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-12 mt-6"
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

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        className="w-full h-12 flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50 transition-colors"
      >
        <GoogleIcon />
        Sign in with Google
      </Button>
    </div>
  );
}

export default Login;