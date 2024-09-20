import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { Button, Input } from "@nextui-org/react";
import { setCookie } from "../../../JsFiles/CommonFunction.mjs";
import { useLoginMutation } from "../Service.mjs";
import { useAppDispatch } from "../../../Common/hooks";
import { updateLoginDetails } from "../../../Common/globalSlice";
import InputNextUI from "../../../Components/Common/Input/input";
import { IconLoginSVG } from "../../../Components/Common/Icons/icon";
const Login = () => {
  const authenticate = (user, next) => {
    if (typeof window !== "undefined") {
      setCookie("token", user.token, 60);
      setCookie("role", user.role, 60);
      setCookie("id", user.id, 60);
      setCookie("vendorId", user?.data?.vendorId, 60);
      setCookie("storeId", user?.data?.storeId, 60);
      setCookie("plan", user?.data?.plan, 60);
      next();
    }
  };
  const dispatch = useAppDispatch();
  const { handleSubmit, control, reset } = useForm();
  const navigate = useNavigate();
  const [login] = useLoginMutation();

  const onSubmit = async (data: any) => {
    const result = await login(data);
    if (result) {
      dispatch(updateLoginDetails(result?.data));
      authenticate(result?.data, () => {
        navigate("/Dashboard");
        window.location.reload();
      });
    }
  };

  return (
    <div
      className="mainLogin"
      style={{
        backgroundColor: "white",
        // width: "1",
        // height: "500px",
        // alignItems: "center",
        // justifyContent: "center",
        // display: "flex",
      }}
    >
      <div className="mt-5">
        <div className="flex justify-center">
          <IconLoginSVG width="250px" height="155px" />
        </div>
        <h2 className="text-2xl font-bold my-4 flex justify-center">Login</h2>

        <div className=" flex justify-center ">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <Controller
                name="email" // Changed to reflect a text input
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  // <Input type="text" label="email" size="lg" {...field} />
                  <InputNextUI
                    type="text"
                    label="Email"
                    size="md"
                    {...field}
                    // errorMessage={errors.password?.message}
                  />
                )}
              />
            </div>
            <div className="mb-3">
              <Controller
                name="password" // Changed to reflect a text input
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  // <Input type="text" label="password" size="lg" {...field} />
                  <InputNextUI
                    type="text"
                    label="Password"
                    size="md"
                    {...field}
                    // errorMessage={errors.password?.message}
                  />
                )}
              />
            </div>
            <div className="text-center">
              <Button color="primary" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
