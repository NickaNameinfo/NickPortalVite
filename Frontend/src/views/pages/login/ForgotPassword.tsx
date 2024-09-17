import {
  Button,
  Checkbox,
  Input,
  Link,
  Radio,
  RadioGroup,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import {
  EyeFilledIcon,
  EyeSlashFilledIcon,
  IconLogin,
  IconRegisterSVG,
} from "../../../Icons";
import { Controller, useForm } from "react-hook-form";
import { useRegisterMutation } from "../login/Service.mjs";
import InputNextUI from "../../../Components/Input/input";
import { useAppSelector } from "../../../Components/Common/hooks";
import ModalUI from "../../../Components/Modal";
import {
  onOpenForget,
  onOpenLogin,
  onOpenResigter,
} from "../../../Components/Common/globalSlice";
import { useDispatch } from "react-redux";
import Login from "./Login";
import { useNavigate } from "react-router-dom";
import { Otp } from "./Otp";
import { useUpdatUserMutation } from "./Service.mjs";


export const ForgotPassword = () => {
  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const formData = watch();

  const [updateUser] = useUpdatUserMutation();

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [otpValue, setOtpValues] = useState(null);
  const [enteredOtp, setEnteredOpt] = React.useState(null);
  const [isEnableNewPassword, setIsEnableNewPassword] = React.useState(false);

  const isOpenLogin = useAppSelector((state) => state.globalConfig.isOpenLogin);
  const isOpenForget = useAppSelector(
    (state) => state.globalConfig.isOpenForget
  );

  const onSubmit = async (data) => {
    try {
      if(!formData?.password){
        if (otpValue) {
          if (otpValue === Number(enteredOtp?.join(""))) {
            setIsEnableNewPassword(true)
          } else {
            alert("Please enter otp sent your mail id");
          }
        } else {
          setOtpValues(9078);
        }
      }else{
        try{
          let result = await updateUser(data)
          console.log(result, "resultrr5234")
          if(result?.data?.success){
            onClickLogin()
          }
        }catch(error){
          console.log(error, "errrorr")
        }
        
      }
    } catch (error) {
      console.log(error, "Error");
    }
  };


  const onCloseModal = () => {
    onClose();
    dispatch(onOpenForget(false));
  };

  const onClickLogin = () => {
    dispatch(onOpenResigter(false));
    dispatch(onOpenLogin(true));
    dispatch(onOpenForget(false));
  };

  return (
    <>
      <ModalUI
        isOpen={isOpenForget}
        onOpenChange={onCloseModal}
        heading={"Forgot Password "}
        headerIcon={<IconRegisterSVG width="200px" height="155px" />}
        content={
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-3 m-0">
              <div className="mt-2">
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
              {isEnableNewPassword && (
                <div className="mt-2">
                 <Controller
                    name="password" // Changed to reflect a text input
                    control={control}
                    rules={{ required: "Please enter new password" }} // Validation rule with custom message
                    render={({ field }) => (
                      <InputNextUI
                        type="text"
                        label="New Password"
                        {...field}
                        errorMessage={errors.password?.message}
                      />
                    )}
                  />
                </div>
              )}
              {otpValue && !isEnableNewPassword && (
                <div className="my-2">
                  <Otp enteredOtp={(value) => setEnteredOpt(value)} />
                </div>
              )}
              <div className="w-full justify-center pt-5">
                <Button
                  size="sm"
                  type="submit"
                  className="w-full  font-normal"
                  style={{
                    padding: 0,
                    margin: 0,
                    background: "#4C86F9",
                    color: "#FFFFFF",
                  }}
                >
                  {otpValue ? "Submit" : "Change Password"}
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
                {"Already have a member ? "}
              </p>
              <Link
                className="cursor-pointer font-medium p-0 m-0"
                style={{
                  color: "#4C86F9",
                }}
                onPress={() => onClickLogin()}
                size="sm"
              >
                {"Login"}
              </Link>
            </div>
          </div>
        }
      />
      {isOpenLogin && <Login />}
    </>
  );
};
