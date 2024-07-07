import React from "react";
import { Input } from "@nextui-org/react";

export const ForgotPassword = () => {
  return (
    <>
      <Input
        classNames={{
          input: [
            "placeholder:text-default-700/50 dark:placeholder:text-white/60",
          ],
        }}
        isRequired
        // isClearable
        autoFocus
        label="Email Address Or Mobile Number"
        labelPlacement="inside"
        color="primary"
        variant="bordered"
      />
    </>
  );
};
