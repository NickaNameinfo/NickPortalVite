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
import { onOpenResigter } from "../../../Components/Common/globalSlice";
import { useDispatch } from "react-redux";

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
  const [register] = useRegisterMutation();
  const [selected, setSelected] = React.useState("0");

  const isOpenRegister = useAppSelector(
    (state) => state.globalConfig.isOpenRegister
  );
  console.log(isOpenRegister, "panelReloadlknsdf");
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const onSubmit = async () => {
    try {
      let tempApiValue = {
        ...formData,
        verify: 1,
        role: selected,
      };
      const result = await register(tempApiValue);
      console.log(result, "asdfyuasoidfu");

      if (result?.data?.success) {
        return;
      }
    } catch (error) {
      console.log(error, "Error");
    }
  };

  const onCloseModal = () => {
    reset();
    onClose();
    dispatch(onOpenResigter(false));
  };

  const onClickLogin = () => {};

  return (
    <>
      <ModalUI
        isOpen={isOpenRegister}
        onOpenChange={onCloseModal}
        heading={"Register"}
        headerIcon={<IconRegisterSVG width="200px" height="155px" />}
        content={
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
                  <RadioGroup
                    size="sm"
                    classNames={{ wrapper: ["justify-evenly"] }}
                    className="py-3"
                    orientation="horizontal"
                    color="primary"
                    value={selected}
                    onValueChange={setSelected}
                  >
                    <Radio
                      value="0"
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
                  <div className="grid grid-cols-2 gap-4 pt-2 pb-2">
                    <Controller
                      name="firstName" // Changed to reflect a text input
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        // <Input type="text" label="Store Name" size="lg" {...field} />
                        <InputNextUI type="text" label="Name" {...field} />
                      )}
                    />
                    <Controller
                      name="email" // Changed to reflect a text input
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        // <Input type="text" label="Store Name" size="lg" {...field} />
                        <InputNextUI type="email" label="Email" {...field} />
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <Controller
                      name="phoneNo" // Changed to reflect a text input
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        // <Input type="text" label="Store Name" size="lg" {...field} />
                        <InputNextUI
                          type="number"
                          label="Mobile Number"
                          {...field}
                        />
                      )}
                    />

                    <Controller
                      name="password" // Changed to reflect a text input
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        // <Input type="text" label="Store Name" size="lg" {...field} />
                        <InputNextUI
                          type="password"
                          label="Password"
                          {...field}
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
                onPress={() => onSubmit()}
                size="sm"
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
    </>
  );
};
