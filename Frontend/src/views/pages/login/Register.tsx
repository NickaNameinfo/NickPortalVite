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
          <Radio value="Customer" color="default">
            Customer
          </Radio>
          <Radio value="Store" color="default">
            Store
          </Radio>
          <Radio value="Vendor" color="default">
            Vendor
          </Radio>
        </RadioGroup>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <Input
            classNames={{
              input: [
                "placeholder:text-white/20 dark:placeholder:text-white/20",
              ],
            }}
            isRequired
            autoFocus
            label="Enter Your Name"
            labelPlacement="inside"
            color="default"
            variant="faded"
          />
          <Input
            classNames={{
              input: [
                "placeholder:text-white/20 dark:placeholder:text-white/20",
              ],
            }}
            isRequired
            autoFocus
            label="Email Address"
            labelPlacement="inside"
            color="default"
            variant="faded"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            classNames={{
              input: [
                "placeholder:text-white/20 dark:placeholder:text-white/20",
              ],
            }}
            isRequired
            autoFocus
            label="Mobile Number"
            labelPlacement="inside"
            color="default"
            variant="faded"
          />

          <Input
            classNames={{
              input: [
                "placeholder:text-white/20 dark:placeholder:text-white/20",
              ],
            }}
            label="Password"
            color="default"
            variant="faded"
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
            <Link
              className="cursor-pointer"
              size="sm"
              style={{
                color: "#7358D7",
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
