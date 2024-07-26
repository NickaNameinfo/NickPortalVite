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
            value="Customer"
            color="success"
            className="font-medium text-xs"
          >
            Customer
          </Radio>
          <Radio value="Store" color="success" className="font-medium text-xs">
            Store
          </Radio>
          <Radio value="Vendor" color="success" className="font-medium text-xs">
            Vendor
          </Radio>
        </RadioGroup>
        <div className="grid grid-cols-2 gap-4 pt-2 pb-2">
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
            label="Enter Your Name"
            labelPlacement="inside"
            color="default"
            variant="faded"
            size="sm"
          />

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
            label="Email Address"
            labelPlacement="inside"
            color="default"
            variant="faded"
            size="sm"
          />
        </div> 
        <div className="grid grid-cols-2 gap-4 mt-2">
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
            label="Mobile Number"
            labelPlacement="inside"
            color="default"
            variant="faded"
            size="sm"
          />

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
            label="Password"
            labelPlacement="inside"
            color="default"
            variant="faded"
            size="sm"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon
                    className="text-2xl text-default-400 pointer-events-none"
                    fill="#8E99A4"
                  />
                ) : (
                  <EyeFilledIcon
                    className="text-2xl text-default-400 pointer-events-none"
                    fill="#8E99A4"
                  />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
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
    </>
  );
};
