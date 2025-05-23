import { useDispatch, useSelector } from "react-redux";
import { setUserCredsData } from "../../redux/global/FormdataSlice";
import { clearSignupState } from "@/redux/api/signupSlice";
import { setOtpInput } from "../../redux/global/GlobalVar";
import { useEffect, useState } from "react";
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
    contactNumber: z.string().nonempty("Contact Number is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserCreds((prevCreds) => ({
      ...prevCreds,
      [id]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: null,
    }));
  };

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

  const FormField = ({ id, label, type, placeholder, icon: Icon, value, onChange, error }) => (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          className={`pl-10 h-12 ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
          type={type}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
      {error && (
        <span className="text-xs text-red-500 block mt-1">
          {error._errors[0]}
        </span>
      )}
    </div>
  );

  return (
    <div className="h-full w-full max-w-4xl mx-auto p-4 sm:p-6">
      {otpInput ? (
        <OtpVerify />
      ) : (
        <>
          <form className="space-y-6" onSubmit={signupSubmit}>
            {/* Name Fields - Horizontal on larger screens, vertical on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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

            {/* Email Field - Full width */}
            <div className="grid grid-cols-1">
              <FormField
                id="email"
                label="Email"
                type="email"
                placeholder="Enter your email address"
                icon={Mail}
                value={userCreds.email}
                onChange={handleChange}
                error={errors.email}
              />
            </div>

            {/* Password Fields - Horizontal on larger screens, vertical on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <FormField
                id="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
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

            {/* Contact Number - Full width */}
            <div className="grid grid-cols-1">
              <FormField
                id="contactNumber"
                label="Contact Number"
                type="tel"
                placeholder="Enter your contact number"
                icon={Phone}
                value={userCreds.contactNumber}
                onChange={handleChange}
                error={errors.contactNumber}
              />
            </div>

            {/* Global Error Messages */}
            {error && (
              <div className="text-red-500 text-sm p-3 bg-red-50 border border-red-200 rounded-md">
                Error: {error}
              </div>
            )}

            {loading && (
              <div className="text-blue-500 text-sm p-3 bg-blue-50 border border-blue-200 rounded-md">
                Loading...
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center md:justify-end pt-4">
              <Button
                type="submit"
                className="w-full md:w-auto min-w-[120px] h-12"
                disabled={loadingButton}
              >
                {loadingButton ? (
                  <div className="flex items-center justify-center gap-2">
                    <PrimarySpinner />
                    <span>Sending OTP...</span>
                  </div>
                ) : (
                  <span className="text-base">Next</span>
                )}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default Register;