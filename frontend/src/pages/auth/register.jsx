import { useState } from "react";
import {
  Alert,
  Button,
  Input,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";

import * as authService from "@/services/auth.service";

export function Register() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState("");
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    role: 2
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setAlert("");
    const { name, value } = event.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: validate(name, value) }));
  };

  const validate = (field, value) => {
    switch (field) {
      case "name":
        return value.length === 0 ? "Name is required" : "";
      case "email":
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Invalid email format" : "";
      case "password":
        return value.length < 8 ||
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]*$/.test(value) ?
          "Password must be at least 8 characters with at least one upper case, one number and one special character" :
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
      const { data } = await authService.register(inputs);

      localStorage.setItem("token", JSON.stringify(`${data.user.type} ${data.user.accessToken}`));

      navigate("/dashboard/home");
    } catch ({ response: { data, status } }) {
      if (status !== 422) {
        setAlert(data.message);
      }
    }
  };

  return (
    <section className="m-8 flex">
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
      <div className="w-full lg:w-3/5 flex flex-col items-center jstify-center">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Join Us Today</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to register.</Typography>
        </div>

        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
          {alert.length !== 0 && (<Alert
            className="mb-5 flex flex-col gap-6"
            color="red"
          >
            {alert}
          </Alert>)}

          <div className="mb-5 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-4 font-medium">
              Name
            </Typography>
            <Input
              size="lg"
              placeholder="John Doe"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              name="name"
              value={inputs.name}
              onChange={handleChange}
              error={errors.name.length > 0}
            />
            {errors.name.length > 0 && (
              <Typography variant="small" color="red" className="text-left">
                {errors.name}
              </Typography>
            )}
          </div>
          <div className="mb-5 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-4 font-medium">
              Email
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
          </div>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-4 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
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
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-4 font-medium">
              Role
            </Typography>
            <Select
              value={inputs.role}
              onChange={handleChange}
            >
              <Option value={2}>ADMIN</Option>
              <Option value={3}>MEMBER</Option>
            </Select>
          </div>
          <Button className="mt-6" fullWidth type="submit">
            Register Now
          </Button>
          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Already have an account?
            <Link to="/auth/login" className="text-gray-900 ml-1">Login</Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default Register;
