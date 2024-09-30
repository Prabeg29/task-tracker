import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Alert, Button, Typography } from "@material-tailwind/react";

import { useAuth } from "@/hooks/useAuth";
import authService from "@/services/auth.service";

export function Login() {
  const { login } = useAuth();
  const [searchParams] = useSearchParams("")
  const [alert, setAlert] = useState("");

  useEffect(() => {
    if (
      searchParams.size &&
      searchParams.get("code")
    ) {
      handleGoogleLogin({
        state: searchParams.get("state"),
        code: searchParams.get("code")
      });
    }
  }, [searchParams])

  const initiateGoogleConsent = async () => {
    try {
      const { data: { link } } = await authService.initiateGoogleConsent();

      window.location.href = new URL(link);
    } catch ({ response: { data: { message }, status } }) {
      if (status !== 422) {
        setAlert(message);
      }
    }
  }

  const handleGoogleLogin = async (payload) => {
    try {
      const { data: { user } } = await authService.googleLogin(payload);
      login(user);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Login</Typography>
        </div>
        <div className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          {alert.length !== 0 && (<Alert
            className="mb-5 flex flex-col gap-6"
            color="red"
          >
            {alert}
          </Alert>)}
          <Button
            variant="outlined"
            size="lg"
            className="mt-6 flex h-12 items-center justify-center gap-2"
            fullWidth
            onClick={initiateGoogleConsent}
          >
            <img
              src={`https://www.material-tailwind.com/logos/logo-google.png`}
              alt="google"
              className="h-6 w-6"
            />{" "}
            sign in with google
          </Button>
        </div>
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
