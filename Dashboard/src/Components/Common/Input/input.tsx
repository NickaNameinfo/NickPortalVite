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
  // className?: any;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const InputNextUI = (props: InputFieldProps) => {
  return (
    <>
      <div className="w-100">
        <Input
          classNames={{
            label: "text-black/60 dark:text-white/60",
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
          // onClear={() => console.log("input cleared")}
          // onValueChange={(value) => {
          //   props.onValueChange(value);
          // }}
          onChange={(e) => {
            props.onChange(e.target.value);
          }}
        />
      </div>
    </>
  );
};

export default InputNextUI;
