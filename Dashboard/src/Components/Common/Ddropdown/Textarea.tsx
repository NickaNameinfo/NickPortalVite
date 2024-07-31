import { Textarea } from "@nextui-org/react";
import React from "react";

interface textareaFieldProps {
  label?: any;
  //   onChange: (value: any) => void;
  // onValueChange?: (value: string) => void;
  variant?: "flat" | "bordered" | "faded" | "underlined";
  type?:
    | "text"
    | "number"
    | "search"
    | "url"
    | "tel"
    | "email"
    | "password"
    | (string & {});
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  size?: "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  validationBehavior?: "native" | "aria";
  labelPlacement?: "inside" | "outside" | "outside-left";
  isClearable?: boolean;
  isRequired?: boolean;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  disableAnimation?: boolean;
  startContent?: any;
  errorMessage?: any;
  placeholder?: string;
  endContent?: any;
  description?: any;
  // className?: any;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const TeaxtareaNextUI = (props: textareaFieldProps) => {
  return (
    <>
      <Textarea
        label={props?.label ?? "label"}
        // variant="faded"
        // color="default"
        // size="md"
        variant={props?.variant ?? "faded"}
        color={props?.color ?? "default"}
        size={props?.size ?? "md"}
        classNames={{
          label: "text-black/60 dark:text-white/60",
          innerWrapper: "bg-transparent",
          inputWrapper: [
            // "shadow-xl",
            "bg-default-100/50",
            "dark:bg-default/70",
            "backdrop-blur-xl",
            "backdrop-saturate-70",
            "hover:bg-default-100/60",
            "focus-within:!bg-default-70/10",
            "dark:hover:bg-default/0",
            "dark:focus-within:!bg-default/90",
            "!cursor-text",
          ],
        }}
      />
    </>
  );
};

export default TeaxtareaNextUI;
