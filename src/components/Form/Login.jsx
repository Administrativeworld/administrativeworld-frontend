import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { login, clearLoginState } from "@/redux/api/loginSlice";
import { toast } from 'react-hot-toast';
import PrimarySpinner from "../Loaders/PrimarySpinner";
import { useNavigate } from "react-router-dom";
import { validateUser } from "@/redux/api/authUserSlice";

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
      navigate("/administrativeworld/home");
    } else if (status && status !== 200) {
      toast.error(`Error: ${status}`);
      dispatch(clearLoginState());
    }
  }, [status, dispatch, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      dispatch(login({ email: loginCreds.email, password: loginCreds.password }));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-full w-full">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="email" className="text-md">Email</Label>
          <Input
            className="px-3 py-5"
            type="email"
            id="email"
            placeholder="Email"
            value={loginCreds.email}
            onChange={(e) => setLoginCreds({ ...loginCreds, email: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="password" className="text-md">Password</Label>
          <Input
            className="px-3 py-5"
            type="password"
            id="password"
            placeholder="Password"
            value={loginCreds.password}
            onChange={(e) => setLoginCreds({ ...loginCreds, password: e.target.value })}
          />
        </div>
        <div className="mt-4 flex justify-end">
          {
            loading ? <Button disabled>
              <span className="text-lg">Login</span>
              <PrimarySpinner />
            </Button> :
              <Button type="submit">
                <span className="text-lg">Login</span>
              </Button>
          }
        </div>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

export default Login;
