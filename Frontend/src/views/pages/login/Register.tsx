import { Checkbox, Input, Link, Radio, RadioGroup } from "@nextui-org/react";
import React from "react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../../../Icons";
import { Controller, useForm } from "react-hook-form";
import { useRegisterMutation } from "../login/Service.mjs";
import InputNextUI from "../../../Components/Input/input";
export const Register = ({ registration = false }) => {
  console.log(registration, "registration345");
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

  React.useEffect(() => {
    if (registration) {
      onSubmit();
    }
  }, [registration]);

  return (
    <>
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
            <Radio value="0" color="success" className="font-medium text-xs">
              Customer
            </Radio>
            <Radio value="3" color="success" className="font-medium text-xs">
              Store
            </Radio>
            <Radio value="2" color="success" className="font-medium text-xs">
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
                <InputNextUI type="number" label="Mobile Number" {...field} />
              )}
            />

            <Controller
              name="password" // Changed to reflect a text input
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                // <Input type="text" label="Store Name" size="lg" {...field} />
                <InputNextUI type="password" label="Password" {...field} />
              )}
            />
          </div>
          <Checkbox
            className="pt-4"
            classNames={{
              label: "text-small",
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
    </>
  );
};
