import { Input } from "@nextui-org/react";
import React from "react";

export const NewPassword = () => {
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
        label="Enter Your Password"
        labelPlacement="inside"
        color="primary"
        variant="bordered"
      />

      <Input
        classNames={{
          input: [
            "placeholder:text-default-700/50 dark:placeholder:text-white/60",
          ],
        }}
        isRequired
        // isClearable
        autoFocus
        label="Enter Your Password"
        labelPlacement="inside"
        color="primary"
        variant="bordered"
      />
    </>
  );
};
