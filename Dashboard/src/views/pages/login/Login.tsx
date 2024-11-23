import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { Button, Input } from "@nextui-org/react";
import { setCookie } from "../../../JsFiles/CommonFunction.mjs";
import { useLoginMutation } from "../Service.mjs";
import { useAppDispatch } from "../../../Common/hooks";
import { updateLoginDetails } from "../../../Common/globalSlice";
import InputNextUI from "../../../Components/Common/Input/input";
import { IconLoginSVG } from "../../../Components/Common/Icons/icon";
import { useAddStoreMutation } from "../../Store/Service.mjs";
import { useAddVendorsMutation } from "../../vendors/Service.mjs";
import { getCookie } from "../../../JsFiles/CommonFunction.mjs";
import { useUpdatUserMutation } from "../../../Service.mjs";
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
    if (result?.data?.success && result?.data?.data?.verify) {
      dispatch(updateLoginDetails(result?.data));
      authenticate(result?.data, () => {
        navigate("/Dashboard");
        window.location.reload();
      });
    } else {
      if (result?.data?.data && !result?.data?.data?.verify) {
        alert(
          "Please connect admin and activate your account Support : 8270564998"
        );
      } else {
        alert("Invalid Credentials");
      }
    }
  };

  return (
    <div className="mainLogin h-[100dvh] flex items-center justify-center">
      <div className="bg-warning-50 p-5 rounded-[calc(theme(borderRadius.large)/1.5)] w-[30%]">
        <div className="flex justify-center">
          <IconLoginSVG width="250px" height="155px" />
        </div>
        <h2 className="text-2xl font-bold my-4 flex justify-center">Login</h2>
        <div className=" flex justify-center ">
          <form onSubmit={handleSubmit(onSubmit)} className="w-[100%]">
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
                Login
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
