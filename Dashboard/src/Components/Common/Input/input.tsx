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
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const InputNextUI = (props: InputFieldProps) => {
  return (
    <>
      <div className="w-100">
        <Input
          classNames={{
            input: [
              "bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            ],
          }}
          variant={props.variant}
          color={props.color}
          validationBehavior={props.validationBehavior}
          size={props.size}
          radius={props.radius}
          label={props.label}
          description={props.description}
          startContent={props.startContent}
          endContent={props.endContent}
          isInvalid={props.isInvalid}
          isClearable={props.isClearable ?? false}
          isDisabled={props.isDisabled}
          isReadOnly={props.isReadOnly}
          isRequired={props.isRequired}
          labelPlacement={props.labelPlacement}
          placeholder={props.placeholder}
          disableAnimation={props.disableAnimation}
          errorMessage={props.errorMessage}
          type={props.type}
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
