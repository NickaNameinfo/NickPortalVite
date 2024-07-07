import { Checkbox, Input, Link, Radio, RadioGroup } from "@nextui-org/react";
import React from "react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "../../../Icons";

export const Register = () => {
  const [selected, setSelected] = React.useState("Customer");
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <>
      <div>
        <p className="font-normal text-md text-slate-600">Register As</p>
        <RadioGroup
          classNames={{ wrapper: ["justify-between"] }}
          className="py-2"
          orientation="horizontal"
          color="primary"
          value={selected}
          onValueChange={setSelected}
        >
          <Radio value="Customer">Customer</Radio>
          <Radio value="Store">Store</Radio>
          <Radio value="Vendor">Vendor</Radio>
        </RadioGroup>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <Input
            isRequired
            // isClearable
            autoFocus
            label="Enter Your Name"
            labelPlacement="inside"
            color="primary"
            variant="bordered"
          />
          <Input
            isRequired
            // isClearable
            label="Email Address"
            labelPlacement="inside"
            color="primary"
            variant="bordered"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            classNames={{
              input: [
                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              ],
            }}
            label="Mobile Number"
            variant="bordered"
            color="primary"
            type="number"
          />

          <Input
            classNames={{
              input: [
                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              ],
            }}
            label="Password"
            variant="bordered"
            color="primary"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon
                    className="text-2xl text-default-400 pointer-events-none"
                    fill="#4c86f9"
                  />
                ) : (
                  <EyeFilledIcon
                    className="text-2xl text-default-400 pointer-events-none"
                    fill="#4c86f9"
                  />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
            className="max-w-xs"
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
            <Link className="cursor-pointer" color="primary" size="sm">
              Terms & Conditions
            </Link>
          </span>
        </Checkbox>
      </div>
    </>
  );
};
