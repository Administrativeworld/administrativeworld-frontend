import { useDispatch, useSelector } from "react-redux";
import { setUserCredsData } from "../../redux/global/FormdataSlice";
import { clearSignupState } from "@/redux/api/signupSlice";
import { setOtpInput } from "../../redux/global/GlobalVar";
import { useEffect, useState, useCallback } from "react";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import OtpVerify from "./OtpVerify";
import axios from "axios";
import toast from "react-hot-toast";
import PrimarySpinner from "../Loaders/PrimarySpinner";
import { User, Mail, Lock, Phone } from 'lucide-react';

const schema = z
  .object({
    firstName: z.string().nonempty("First Name is required"),
    lastName: z.string().nonempty("Last Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters long"),
    contactNumber: z.string()
      .regex(/^\d{10}$/, "Contact number must be exactly 10 digits"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const FormField = ({ id, label, type, placeholder, icon: Icon, value, onChange, error }) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </Label>
    <div className="relative group">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 h-4 w-4 transition-colors duration-200" />
      <Input
        className={`pl-10 h-11 transition-all duration-200 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
          }`}
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
    {error && (
      <span className="text-xs text-red-500 flex items-center gap-1 mt-1 animate-in slide-in-from-top-1 duration-200">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error._errors?.[0] || error}
      </span>
    )}
  </div>
);

const ContactFormField = ({ id, label, icon: Icon, value, onChange, error }) => (
  <div className="space-y-2">
    <Label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </Label>
    <div className="relative group">
      <div className="flex">
        <div className="flex items-center px-3 bg-gray-50 dark:bg-gray-700 border border-r-0 border-gray-200 dark:border-gray-600 group-focus-within:border-blue-500 dark:group-focus-within:border-blue-400 rounded-l-md h-11 transition-colors duration-200">
          <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">+91</span>
        </div>
        <Input
          className={`h-11 rounded-l-none transition-all duration-200 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
            }`}
          type="tel"
          id={id}
          placeholder="Enter 10-digit mobile number"
          value={value}
          onChange={onChange}
          maxLength={10}
        />
      </div>
    </div>
    {error && (
      <span className="text-xs text-red-500 flex items-center gap-1 mt-1 animate-in slide-in-from-top-1 duration-200">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error._errors?.[0] || error}
      </span>
    )}
  </div>
);

function Register() {
  const dispatch = useDispatch();
  const { loading, error, status } = useSelector((state) => state.signup);
  const { otpInput } = useSelector((state) => state.globalVar);
  const [loadingButton, setLoadingButton] = useState(false);
  const [userCreds, setUserCreds] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (status === 201) {
      setUserCreds({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        contactNumber: "",
      });
      dispatch(clearSignupState());
      dispatch(setOtpInput(false));
    }
  }, [dispatch, status]);

  const handleChange = useCallback((e) => {
    const { id, value } = e.target;
    setUserCreds((prevCreds) => ({
      ...prevCreds,
      [id]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: null,
    }));
  }, []);

  const handleContactChange = useCallback((e) => {
    const { id, value } = e.target;
    const numericValue = value.replace(/\D/g, '').slice(0, 10);

    setUserCreds((prevCreds) => ({
      ...prevCreds,
      [id]: numericValue,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: null,
    }));
  }, []);

  const signupSubmit = async (e) => {
    e.preventDefault();
    const result = schema.safeParse(userCreds);
    if (!result.success) {
      const newErrors = result.error.format();
      setErrors(newErrors);
    } else {
      try {
        dispatch(setUserCredsData(userCreds));
        try {
          setLoadingButton(true);
          const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/auth/sendotp`,
            { email: userCreds.email },
            { withCredentials: true }
          );
          if (response.status === 200) {
            dispatch(setOtpInput(true));
            setLoadingButton(false);
            toast.success("OTP sent to email");
          }
        } catch (error) {
          setLoadingButton(false);
          console.error(error);
        } finally {
          setLoadingButton(false);
        }
      } catch (err) {
        console.error("Error dispatching setUserCredsData: ", err);
      }
    }
  };

  return (
    <div className="w-full">
      {otpInput ? (
        <div className="animate-in slide-in-from-right-5 duration-300">
          <OtpVerify />
        </div>
      ) : (
        <div className="animate-in fade-in-50 duration-200">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Create Account
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Fill in your information to get started
            </p>
          </div>

          <form className="space-y-5" onSubmit={signupSubmit}>
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                id="firstName"
                label="First Name"
                type="text"
                placeholder="Enter your first name"
                icon={User}
                value={userCreds.firstName}
                onChange={handleChange}
                error={errors.firstName}
              />
              <FormField
                id="lastName"
                label="Last Name"
                type="text"
                placeholder="Enter your last name"
                icon={User}
                value={userCreds.lastName}
                onChange={handleChange}
                error={errors.lastName}
              />
            </div>

            {/* Email Field */}
            <FormField
              id="email"
              label="Email Address"
              type="email"
              placeholder="Enter your email address"
              icon={Mail}
              value={userCreds.email}
              onChange={handleChange}
              error={errors.email}
            />

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                id="password"
                label="Password"
                type="password"
                placeholder="Create a password"
                icon={Lock}
                value={userCreds.password}
                onChange={handleChange}
                error={errors.password}
              />
              <FormField
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                icon={Lock}
                value={userCreds.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
            </div>

            {/* Contact Number */}
            <ContactFormField
              id="contactNumber"
              label="Contact Number"
              icon={Phone}
              value={userCreds.contactNumber}
              onChange={handleContactChange}
              error={errors.contactNumber}
            />

            {/* Global Error Messages */}
            {error && (
              <div className="text-red-500 text-sm p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Error: {error}
                </div>
              </div>
            )}

            {loading && (
              <div className="text-blue-500 text-sm p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-11  font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                disabled={loadingButton}
              >
                {loadingButton ? (
                  <div className="flex items-center justify-center gap-2">
                    <PrimarySpinner />
                    <span>Sending OTP...</span>
                  </div>
                ) : (
                  <span className="text-base">Create Account</span>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Register;