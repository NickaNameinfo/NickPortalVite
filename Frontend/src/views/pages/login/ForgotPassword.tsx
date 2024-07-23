import React from "react";
import { Input } from "@nextui-org/react";

export const ForgotPassword = () => {
  return (
    <>
      <Input
        classNames={{
          input: ["placeholder:text-white/20 dark:placeholder:text-white/20"],
        }}
        isRequired
        autoFocus
        label="Email Address Or Mobile Number"
        labelPlacement="inside"
        color="default"
        variant="faded"
      />
    </>
  );
};
