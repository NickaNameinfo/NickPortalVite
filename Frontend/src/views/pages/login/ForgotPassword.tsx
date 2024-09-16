import {
  Button,
  Checkbox,
  Input,
  Link,
  Radio,
  RadioGroup,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
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
  const navigate = useNavigate();
  const [register] = useRegisterMutation();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const isOpenRegister = useAppSelector(
    (state) => state.globalConfig.isOpenRegister
  );
  const isOpenLogin = useAppSelector((state) => state.globalConfig.isOpenLogin);
  const isOpenForget = useAppSelector((state) => state.globalConfig.isOpenForget);

console.log(isOpenForget, "isOpenForget9879")
  const onSubmit = async () => {
    try {
      // let tempApiValue = {
      //   ...formData,
      //   verify: 0,
      // };
      // const result = await register(tempApiValue);
      // if (result?.data?.success) {
      //   dispatch(onOpenResigter(false));
      //   dispatch(onOpenLogin(true));
      //   dispatch(onOpenForget(false));
      // }
    } catch (error) {
      console.log(error, "Error");
    }
  };

  const onCloseModal = () => {
    onClose()
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
                <Input
                  className="max-w-xs"
                  classNames={{
                    label: "text-black/50 dark:text-white/50",
                    input: [
                      "bg-transparent",
                      "text-black/90 dark:text-white/100",
                      "placeholder:text-default-100/50 dark:placeholder:text-white/10",
                    ],
                    innerWrapper: "bg-transparent",
                    inputWrapper: [
                      // "shadow-xl",
                      "bg-default-100/50",
                      "dark:bg-default/60",
                      "backdrop-blur-xl",
                      "backdrop-saturate-50",
                      "hover:bg-default-100/40",
                      "focus-within:!bg-default-50/10",
                      "dark:hover:bg-default/10",
                      "dark:focus-within:!bg-default/90",
                      "!cursor-text",
                    ],
                  }}
                  // isRequired

                  autoFocus
                  label="Email Id"
                  labelPlacement="inside"
                  color="default"
                  variant="faded"
                  size="sm"
                />
              </div>

              <div className="w-full justify-center pt-5">
                <Button
                  size="sm"
                  type="submit"
                  className="w-full  font-normal "
                  style={{
                    padding: 0,
                    margin: 0,
                    background: "#4C86F9",
                    color: "#FFFFFF",
                  }}
                >
                  {"Register"}
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
