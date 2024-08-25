import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { Button, Input } from "@nextui-org/react";
import { setCookie } from "../../../JsFiles/CommonFunction.mjs";
import { useLoginMutation } from "../Service.mjs";
import { useAppDispatch } from "../../../Common/hooks";
import { updateLoginDetails } from "../../../Common/globalSlice";
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
    <div className="mainLogin">
      <div className="wrapperlogin">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <Controller
              name="email" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input type="text" label="email" size="lg" {...field} />
              )}
            />
          </div>
          <div className="mb-3">
            <Controller
              name="password" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input type="text" label="password" size="lg" {...field} />
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
  );
};

export default Login;
