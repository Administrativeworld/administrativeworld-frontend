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

  return (
    <div className="h-full w-full">
      {otpInput ? (
        <OtpVerify />
      ) : (
        <>
          <form className="flex flex-col gap-3" onSubmit={signupSubmit}>
            <div>
              <Label htmlFor="firstName" className="text-sm">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  className={`pl-10 py-5 ${errors.firstName ? "border-red-500" : ""
                    }`}
                  type="text"
                  id="firstName"
                  placeholder="First Name"
                  value={userCreds.firstName}
                  onChange={handleChange}
                />
              </div>
              {errors.firstName && (
                <span className="text-xs text-red-500">
                  {errors.firstName._errors[0]}
                </span>
              )}
            </div>
            <div>
              <Label htmlFor="lastName" className="text-sm">Last Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  className={`pl-10 py-5 ${errors.lastName ? "border-red-500" : ""
                    }`}
                  type="text"
                  id="lastName"
                  placeholder="Last Name"
                  value={userCreds.lastName}
                  onChange={handleChange}
                />
              </div>
              {errors.lastName && (
                <span className="text-xs text-red-500">
                  {errors.lastName._errors[0]}
                </span>
              )}
            </div>
            <div>
              <Label htmlFor="email" className="text-sm">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  className={`pl-10 py-5 ${errors.email ? "border-red-500" : ""
                    }`}
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={userCreds.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && (
                <span className="text-xs text-red-500">
                  {errors.email._errors[0]}
                </span>
              )}
            </div>
            <div>
              <Label htmlFor="password" className="text-sm">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  className={`pl-10 py-5 ${errors.password ? "border-red-500" : ""
                    }`}
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={userCreds.password}
                  onChange={handleChange}
                />
              </div>
              {errors.password && (
                <span className="text-xs text-red-500">
                  {errors.password._errors[0]}
                </span>
              )}
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-sm">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  className={`pl-10 py-5 ${errors.confirmPassword ? "border-red-500" : ""
                    }`}
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  value={userCreds.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              {errors.confirmPassword && (
                <span className="text-xs text-red-500">
                  {errors.confirmPassword._errors[0]}
                </span>
              )}
            </div>
            <div>
              <Label htmlFor="contactNumber" className="text-sm">Contact Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  className={`pl-10 py-5 ${errors.contactNumber ? "border-red-500" : ""
                    }`}
                  type="tel"
                  id="contactNumber"
                  placeholder="Contact Number"
                  value={userCreds.contactNumber}
                  onChange={handleChange}
                />
              </div>
              {errors.contactNumber && (
                <span className="text-xs text-red-500">
                  {errors.contactNumber._errors[0]}
                </span>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              {loadingButton ? (
                <Button disabled>
                  <span className="text-lg">Next</span>
                  <PrimarySpinner />
                </Button>
              ) : (
                <Button type="submit">
                  <span className="text-lg">Next</span>
                </Button>
              )}
            </div>
          </form>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
        </>
      )}
    </div>
  );
}

export default Register;
