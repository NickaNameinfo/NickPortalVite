import React from "react";
import { Input } from "@nextui-org/react";

export const ForgotPassword = () => {
  return (
    <>
      <div className="my-2">
        <div className="flex justify-center mb-4">
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
            label="Email Address Or Mobile Number"
            labelPlacement="inside"
            color="default"
            variant="faded"
            size="sm"
          />
        </div>
      </div>
      {/* <Input
        classNames={{
          input: ["placeholder:text-white/20 dark:placeholder:text-white/20"],
        }}
        isRequired
        autoFocus
        label="Email Address Or Mobile Number"
        labelPlacement="inside"
        color="default"
        variant="faded"
      /> */}
    </>
  );
};
