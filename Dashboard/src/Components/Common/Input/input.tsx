import { Input } from "@nextui-org/react";

export interface InputFieldProps {
  label?: string;
  onChange(e: any, value: any): void;
  onClear(e: any, value: any): void;
  onValueChange(e: any, value: any): void;
  variant?: "flat" | "bordered" | "faded" | "underlined";
  type?:
    | "text"
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
  isClearable: boolean;
  isRequired: boolean;
  isReadOnly: boolean;
  isDisabled: boolean;
  isInvalid: boolean;
  disableAnimation: boolean;
  startContent: any;
  endContent: any;
}

const InputNextUI = () => {
  <>
    <div className="w-100">
      <Input
        description="cbscb"
        startContent={<p>fjvc</p>}
        labelPlacement="inside"
        placeholder="inpute"
        type=""
        onValueChange={(e) => {
          console.log(e, "dkjbzv");
        }}
      />
    </div>
  </>;
};

export default InputNextUI;
