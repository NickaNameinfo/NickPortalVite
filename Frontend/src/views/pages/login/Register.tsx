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
  onOpenLogin,
  onOpenResigter,
} from "../../../Components/Common/globalSlice";
import { useDispatch } from "react-redux";
import Login from "./Login";
import { useNavigate } from "react-router-dom";

export const Register = () => {
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
  const isOpenRegister = useAppSelector(
    (state) => state.globalConfig.isOpenRegister
  );
  const isOpenLogin = useAppSelector((state) => state.globalConfig.isOpenLogin);

  const onSubmit = async () => {
    try {
      let tempApiValue = {
        ...formData,
        verify: formData?.role === 0 ? 1 : 0,
      };
      const result = await register(tempApiValue);
      if (result?.data?.success) {
        dispatch(onOpenResigter(false));
        dispatch(onOpenLogin(true));
      }
    } catch (error) {
      console.log(error, "Error");
    }
  };

  const onCloseModal = () => {
    dispatch(onOpenResigter(false));
  };

  const onClickLogin = () => {
    dispatch(onOpenResigter(false));
    dispatch(onOpenLogin(true));
  };

  return (
    <>
      <ModalUI
        isOpen={isOpenRegister}
        onOpenChange={onCloseModal}
        heading={"Register"}
        headerIcon={<IconRegisterSVG width="200px" height="155px" />}
        content={
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-3 m-0">
              <div className="mt-2">
                <form>
                  <div>
                    <p
                      className="font-normal text-sm"
                      style={{
                        color: "#555555",
                      }}
                    >
                      Register As
                    </p>
                    <Controller
                      name="role"
                      control={control}
                      rules={{ required: "Please select a role" }} // Validation rule with custom message
                      render={({ field }) => (
                        <div className="py-3">
                          <RadioGroup
                            size="sm"
                            classNames={{ wrapper: ["justify-evenly"] }}
                            orientation="horizontal"
                            color="primary"
                            {...field}
                          >
                            <Radio
                              value="1"
                              color="success"
                              className="font-medium text-xs"
                            >
                              Customer
                            </Radio>
                            <Radio
                              value="3"
                              color="success"
                              className="font-medium text-xs"
                            >
                              Store
                            </Radio>
                            <Radio
                              value="2"
                              color="success"
                              className="font-medium text-xs"
                            >
                              Vendor
                            </Radio>
                          </RadioGroup>

                          {/* Render the error message conditionally */}
                          {errors.role && (
                            <p className="text-red-500 text-xs mt-2">
                              {String(errors.role.message)}
                            </p>
                          )}
                        </div>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4 pt-2 pb-2">
                      <Controller
                        name="firstName" // Changed to reflect a text input
                        control={control}
                        rules={{ required: "Name is required" }}
                        render={({ field }) => (
                          <InputNextUI
                            type="text"
                            label="Name"
                            {...field}
                            errorMessage={errors?.firstName?.["message"]}
                          />
                        )}
                      />

                      <Controller
                        name="email" // Changed to reflect a text input
                        control={control}
                        rules={{ required: "Email is required" }}
                        render={({ field }) => (
                          <InputNextUI
                            type="email"
                            label="Email"
                            {...field}
                            errorMessage={errors?.email?.["message"]}
                          />
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <Controller
                        name="phoneNo" // Changed to reflect a text input
                        control={control}
                        rules={{ required: "Phone Number is required" }}
                        render={({ field }) => (
                          <InputNextUI
                            type="number"
                            label="Mobile Number"
                            {...field}
                            errorMessage={errors?.phoneNo?.["message"]}
                          />
                        )}
                      />

                      <Controller
                        name="password" // Changed to reflect a text input
                        control={control}
                        rules={{ required: "Password is required" }}
                        render={({ field }) => (
                          <InputNextUI
                            type="password"
                            label="Password"
                            {...field}
                            errorMessage={errors?.password?.["message"]}
                          />
                        )}
                      />
                    </div>
                    <Checkbox
                      className="pt-4"
                      classNames={{
                        label: ["text-small", "text-gray-400", "font-light"],
                        wrapper: ["before:border-1", "before:border-gray-300"],
                      }}
                    >
                      Accept the all{" "}
                      <span>
                        <Link
                          className="cursor-pointer"
                          size="sm"
                          style={{
                            color: "#4C86F9",
                          }}
                        >
                          Terms & Conditions
                        </Link>
                      </span>
                    </Checkbox>
                  </div>
                </form>
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
