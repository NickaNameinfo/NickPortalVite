import { Input } from "@nextui-org/react";
import * as React from "react";

interface InputFieldProps {
  label?: any;
  onChange: (value: any) => void;
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
  value?: any;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  min?:number | string;
  defaultValue?:any | string;
}

const InputNextUI = (props: InputFieldProps) => {
  return (
    <>
      {/* <div className="w-100"> */}
        <Input
          {...props}
          classNames={{
            label:
              "text-black/60 dark:text-white/60",
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
          variant={props?.variant ?? "bordered"}
          color={props?.color ?? "default"}
          size={props?.size ?? "sm"}
          isClearable={props?.isClearable ?? false}
          labelPlacement={props?.labelPlacement ?? "inside"}
          onChange={(e) => {
            props.onChange(e.target.value);
          }}
          defaultValue={props?.defaultValue ?? ""}
        />
      {/* </div> */}
    </>
  );
};

export default InputNextUI;
