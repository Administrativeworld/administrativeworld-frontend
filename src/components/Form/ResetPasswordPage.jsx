import React, { useState, useCallback } from 'react'
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import axios from "axios";
import toast from "react-hot-toast";
import { Lock, CheckCircle, Eye, EyeOff } from 'lucide-react';

// Password validation schema with 6 validation rules
const passwordSchema = z
  .object({
    newPassword: z.string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
      .max(50, "Password must not exceed 50 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Password strength checker
const getPasswordStrength = (password) => {
  const checks = [
    { test: password.length >= 8, label: "At least 8 characters" },
    { test: /[a-z]/.test(password), label: "One lowercase letter" },
    { test: /[A-Z]/.test(password), label: "One uppercase letter" },
    { test: /\d/.test(password), label: "One number" },
    { test: /[!@#$%^&*(),.?":{}|<>]/.test(password), label: "One special character" },
    { test: password.length <= 50, label: "Maximum 50 characters" }
  ];

  return checks;
};

// Form field component with show/hide password toggle
const PasswordField = ({ id, label, placeholder, value, onChange, error, showToggle = false }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          className={`pl-10 pr-10 h-12 ${error ? "border-destructive focus:border-destructive focus:ring-destructive" : ""}`}
          type={showToggle && showPassword ? "text" : "password"}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && (
        <span className="text-xs text-destructive block mt-1">
          {error._errors?.[0] || error}
        </span>
      )}
    </div>
  );
};

// Password strength indicator component
const PasswordStrengthIndicator = ({ password }) => {
  const checks = getPasswordStrength(password);
  const passedChecks = checks.filter(check => check.test).length;

  const getStrengthColor = () => {
    if (passedChecks <= 2) return "bg-red-500";
    if (passedChecks <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passedChecks <= 2) return "Weak";
    if (passedChecks <= 4) return "Medium";
    return "Strong";
  };

  if (!password) return null;

  return (
    <div className="space-y-3">
      {/* Strength bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Password Strength</span>
          <span className={`font-medium ${passedChecks <= 2 ? "text-red-600" :
            passedChecks <= 4 ? "text-yellow-600" : "text-green-600"
            }`}>
            {getStrengthText()}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${(passedChecks / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements checklist */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground">Password Requirements:</p>
        <div className="grid grid-cols-1 gap-1">
          {checks.map((check, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${check.test ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
                }`}>
                {check.test && <CheckCircle className="w-3 h-3" />}
              </div>
              <span className={check.test ? "text-green-600" : "text-muted-foreground"}>
                {check.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');

  // Handle password input changes
  const handlePasswordChange = useCallback((e) => {
    const { id, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [id]: value
    }));
    setErrors(prev => ({
      ...prev,
      [id]: null
    }));
    setGlobalError('');
  }, []);

  // Reset password
  const resetPassword = async (e) => {
    e.preventDefault();
    const result = passwordSchema.safeParse(passwords);

    if (!result.success) {
      setErrors(result.error.format());
      return;
    }

    try {
      setLoading(true);
      setGlobalError('');

      // Extract token from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token') || window.location.pathname.split('/').pop();

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/reset-password`,
        {
          token,
          newPassword: passwords.newPassword
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Password reset successfully");
        setSuccess(true);
      }
    } catch (error) {
      setGlobalError("Failed to reset password. The link may be expired or invalid.");
      toast.error("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              {success ? 'Password Reset Complete' : 'Set New Password'}
            </CardTitle>
            <CardDescription>
              {success
                ? 'Your password has been successfully updated'
                : 'Create a strong password for your account'
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {success ? (
              // Success screen
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-green-600">Success!</h3>
                  <p className="text-sm text-muted-foreground">
                    You can now sign in with your new password
                  </p>
                </div>
                <Button
                  onClick={() => window.location.href = '/login'}
                  className="w-full h-12"
                >
                  Continue to Login
                </Button>
              </div>
            ) : (
              // Password reset form
              <form onSubmit={resetPassword} className="space-y-6">
                <PasswordField
                  id="newPassword"
                  label="New Password"
                  placeholder="Enter your new password"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  error={errors.newPassword}
                  showToggle={true}
                />

                {/* Password strength indicator */}
                <PasswordStrengthIndicator password={passwords.newPassword} />

                <PasswordField
                  id="confirmPassword"
                  label="Confirm New Password"
                  placeholder="Re-enter your new password"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  error={errors.confirmPassword}
                />

                {globalError && (
                  <Alert variant="destructive">
                    <AlertDescription>{globalError}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full h-12"
                  disabled={loading}
                >
                  {loading ? "Updating Password..." : "Update Password"}
                </Button>
              </form>
            )}

            {/* Footer link */}
            {!success && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Remember your password?{' '}
                  <a href="/login" className="text-primary hover:underline font-medium">
                    Back to Login
                  </a>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ResetPasswordPage