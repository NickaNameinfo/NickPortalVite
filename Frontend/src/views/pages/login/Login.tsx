import React from "react";
import { Button, useDisclosure, Checkbox, Link } from "@nextui-org/react";
import { IconLogin, IconLoginSVG, IconProfile } from "../../../Icons";
import InputNextUI from "../../../Components/Input/input";
import ModalUI from "../../../Components/Modal";
import { useDispatch } from "react-redux";
import {
  onOpenLogin,
  onOpenResigter,
  updateLoginDetails,
} from "../../../Components/Common/globalSlice";
import { useAppSelector } from "../../../Components/Common/hooks";
import { Register } from "./Register";
import { Controller, useForm } from "react-hook-form";
import { useLoginMutation } from "./Service.mjs";
import { authenticate } from "../../../Components/Common/CustomHooks";
const Login = () => {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const formData = watch();
  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isOpenRegister = useAppSelector(
    (state) => state.globalConfig.isOpenRegister
  );
  const isOpenLogin = useAppSelector((state) => state.globalConfig.isOpenLogin);

  const onCloseModal = () => {
    onClose();
    dispatch(onOpenLogin(false));
  };

  const onClickRegister = () => {
    dispatch(onOpenResigter(true));
    dispatch(onOpenLogin(false));
    onClose();
  };

  const onSubmit = async () => {
    try {
      const result = await login(formData);
      if (result?.data?.success) {
        authenticate(result?.data, () => {
          onClose();
          dispatch(onOpenLogin(false));
          dispatch(updateLoginDetails(result?.data));
        });
      }
    } catch (error) {
      console.log(error, "Error");
    }
  };

  return (
    <div>
      <Button
        isIconOnly
        color="primary"
        className="bg-primary-900"
        aria-label="Take a photo"
        onPress={() => dispatch(onOpenLogin(true))}
      >
        <IconProfile />
      </Button>

      <ModalUI
        isOpen={isOpenLogin}
        onOpenChange={onCloseModal}
        heading={"Login"}
        headerIcon={<IconLoginSVG width="200px" height="155px" />}
        content={
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-3 m-0">
              <div className="mt-2">
                <div className="flex justify-center mb-4">
                  <Controller
                    name="email" // Changed to reflect a text input
                    control={control}
                    rules={{ required: "Please select a user name" }} // Validation rule with custom message
                    render={({ field }) => (
                      <InputNextUI
                        type="text"
                        label="Email"
                        {...field}
                        errorMessage={errors.email?.message}
                      />
                    )}
                  />
                </div>
                <div className="flex justify-center  mt-3">
                  <Controller
                    name="password" // Changed to reflect a text input
                    control={control}
                    rules={{ required: "Please select a password" }} // Validation rule with custom message
                    render={({ field }) => (
                      <InputNextUI
                        type="text"
                        label="Password"
                        {...field}
                        errorMessage={errors.password?.message}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="w-full flex pt-5">
                <div className="flex w-1/2">
                  <Checkbox
                    className="justify-center flex"
                    color="primary"
                    radius="sm"
                    classNames={{
                      label: ["text-small", "text-gray-400", "font-light"],
                      wrapper: ["before:border-1", "before:border-gray-300"],
                    }}
                  >
                    Remember Me
                  </Checkbox>
                </div>
                <div className="w-1/2 justify-end flex ">
                  <Link
                    className="cursor-pointer p-0 m-0 #7358D7 max-w-md "
                    style={{
                      color: "#4C86F9",
                    }}
                    // color="foreground"
                    onPress={() => {}}
                    size="sm"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>
              <div className="w-full justify-center pt-5">
                <Button
                  type="submit"
                  size="sm"
                  className="w-full  font-normal "
                  style={{
                    padding: 0,
                    margin: 0,
                    background: "#4C86F9",
                    color: "#FFFFFF",
                  }}
                >
                  {"LOGIN"}
                  <IconLogin fill="white" />
                </Button>
              </div>
            </div>
          </form>
        }
        footerContent={
          <div className="w-full flex justify-center">
            <div className="flex items-center my-3">
              <p
                className="text-sm pe-2 Iconweb"
                style={{
                  color: "#A5A5A5",
                }}
              >
                {"Not A Member ? "}
              </p>
              <Link
                className="cursor-pointer font-medium p-0 m-0"
                style={{
                  color: "#4C86F9",
                }}
                onPress={() => onClickRegister()}
                size="sm"
              >
                {"Register Now"}
              </Link>
            </div>
          </div>
        }
      />
      {isOpenRegister && <Register />}
    </div>
  );
};

export default Login;
