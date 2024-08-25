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
}

const InputNextUI = (props: InputFieldProps) => {
  return (
    <>
      <div className="w-100">
        <Input
          {...props}
          classNames={{
            label:
              "text-black/60 dark:text-white/60",
            // group-data-[filled=true]:-translate-y-3
            input: [
              "bg-transparent",
              "text-black/90 dark:text-white/100",
              "placeholder:text-default-100/30 dark:placeholder:text-white/10",
              "font-normal",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              // "shadow-xl",
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
              // `${
              //   !props?.errorMessage && "data-[hover=true]:border-gray-600/20"
              // }`,
              // `${
              //   !props?.errorMessage &&
              //   "dark:data-[hover=true]:border-gray-600/20"
              // }`,
            ],
          }}
          // className={props.className ?? "max-w-sm"}
          variant={props?.variant ?? "faded"}
          color={props?.color ?? "default"}
          validationBehavior={props.validationBehavior}
          size={props?.size ?? "sm"}
          radius={props?.radius}
          label={props?.label}
          description={props?.description}
          startContent={props?.startContent}
          endContent={props?.endContent}
          isInvalid={props?.isInvalid}
          isClearable={props?.isClearable ?? false}
          isDisabled={props?.isDisabled}
          isReadOnly={props?.isReadOnly}
          isRequired={props?.isRequired}
          labelPlacement={props?.labelPlacement ?? "inside"}
          placeholder={props?.placeholder}
          disableAnimation={props?.disableAnimation}
          errorMessage={props?.errorMessage}
          type={props?.type}
          onChange={(e) => {
            props.onChange(e.target.value);
          }}
        />
      </div>
    </>
  );
};

export default InputNextUI;
