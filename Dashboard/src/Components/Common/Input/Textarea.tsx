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
        variant={props?.variant ?? "bordered"}
        maxRows={3}
        color={props?.color ?? "default"}
        size={props?.size ?? "md"}
        {...props}
        classNames={{
          label: "text-black/60 dark:text-white/60",
          input: [
            "bg-transparent",
            "text-black/90 dark:text-white/100",
            "placeholder:text-default-100/30 dark:placeholder:text-white/10",
            "font-normal",
          ],
          innerWrapper: "bg-transparent",
          inputWrapper: [
            "bg-transparent",
            "dark:bg-transparent",
            "backdrop-blur-xl",
            "backdrop-saturate-50",
            "hover:bg-transparent",
            "focus-within:!bg-transparent",
            "dark:hover:bg-transparent",
            "dark:focus-within:!bg-transparent",
            "!cursor-text",
            "shadow-none",
            "border-1",
          ],
        }}
      />
    </>
  );
};

export default TeaxtareaNextUI;
