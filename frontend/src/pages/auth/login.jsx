import {
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";

import * as authService from "@/services/auth.service";

export function Login() {
  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({ email: "", password: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: validate(name, value) }));
  };

  const validate = (field, value) => {
    switch (field) {
      case "email":
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Invalid email format" : "";
      case "password":
        return value.length < 8 || 
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]*$/.test(value) ? 
          "Password must be at least 8 characters long with at least 1 uppercase, 1 number and 1 special character" : 
          "";
      default:
        return "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let hasError = false;
    Object.values(errors).forEach((error) => {
      if (error.length > 0) {
        hasError = true;
      }
    });

    if (hasError) {
      return;
    }

    try {
      const { status, data } = await authService.login(inputs);

      if (status !== 200) {
        throw "Something went wrong"
      }

      localStorage.setItem("token", `${data.user.type} ${data.user.accessToken}`);

      navigate("/dashboard/home");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Login</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to login.</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              name="email"
              value={inputs.email}
              onChange={handleChange}
              error={errors.email.length > 0}
            />
            {errors.email.length > 0 && (
              <Typography variant="small" color="red" className="text-left">
                {errors.email}
              </Typography>
            )}
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              type={passwordShown ? "text" : "password"}
              icon={
                <i onClick={togglePasswordVisiblity}>
                  {passwordShown ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </i>
              }
              name="password"
              value={inputs.password}
              onChange={handleChange}
              error={errors.password.length > 0}
            />
            {errors.password.length > 0 && (
              <Typography variant="small" color="red" className="text-left">
                {errors.password}
              </Typography>
            )}
          </div>
          <Button className="mt-6" fullWidth type="submit">
            Login
          </Button>

          <div className="flex items-center justify-between gap-2 mt-6">
            <Typography variant="small" className="font-medium text-gray-900">
              <a href="#">
                Forgot Password
              </a>
            </Typography>
          </div>
          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Not registered?
            <Link to="/auth/register" className="text-gray-900 ml-1">Create account</Link>
          </Typography>
        </form>
      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
    </section>
  );
}

export default Login;
