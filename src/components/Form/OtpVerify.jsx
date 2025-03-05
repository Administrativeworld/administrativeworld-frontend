import { useState, useEffect } from "react";
import OtpInput from 'react-otp-input';
import { useDispatch, useSelector } from "react-redux";
import { clearUserCredsData } from "@/redux/global/FormdataSlice";
import { setOtpInput } from "@/redux/global/GlobalVar";

import { Button } from "../ui/button";
import { signup } from "@/redux/api/signupSlice";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import toast from 'react-hot-toast';
import { ArrowLeft } from "lucide-react";
import PrimarySpinner from "../Loaders/PrimarySpinner";

function OtpVerify() {
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");
  const { status } = useSelector(state => state.signup);
  const { userCreds } = useSelector(state => state.formData);
  const [loadingButton, setLoadingButton] = useState(false);

  useEffect(() => {
    if (status === 201) {
      toast.success("Registration successful!");
      dispatch(clearUserCredsData())
    } else if (status && status !== 201) {
      toast.error(`Error: ${status}`);
    }
  }, [status]);

  const submit = (e) => {
    e.preventDefault();
    try {
      setLoadingButton(true)
      dispatch(signup({ ...userCreds, otp }));
    } catch (error) {
      setLoadingButton(false)
      console.error(error)
    } finally {
      setLoadingButton(false)
    }

  };

  return (
    <Card >
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Verify OTP</CardTitle>
        <CardDescription>
          <div className="flex items-center">
            <span>{userCreds.email}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <form className="w-full flex gap-3 flex-col items-center" onSubmit={submit}>
            <OtpInput
              inputStyle={{ outline: "solid gray", color: "black", fontSize: 25, borderRadius: 5 }}
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span>-</span>}
              renderInput={(props) => <input {...props} />}
            />
            <div className="mt-5 w-full flex">
              <Button type='button' className=" mr-auto" size="icon" onClick={() => { dispatch(setOtpInput(false)) }}>
                <ArrowLeft />
              </Button>
              {
                loadingButton ?
                  <Button disabled className="w-[40%] ml-auto" size="lg">
                    <span className="text-lg">Register</span>
                    <PrimarySpinner />
                  </Button> :
                  <Button type="submit" className="w-[40%] ml-auto" size="lg">
                    <span className="text-lg">Register</span>

                  </Button>
              }

            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

export default OtpVerify;
