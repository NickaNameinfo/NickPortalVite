import React from "react";
import { Input } from "@nextui-org/react";

export const Otp = ({enteredOtp=null}) => {
  const [otpValues, setOtpValues] = React.useState(["", "", "", ""]);

  const handleInputChange = (index: any, value: any) => {
    // Update the values array with the new digit
    const newValues = [...otpValues];
    newValues[index] = value;
    setOtpValues(newValues);
    enteredOtp(newValues)
    // Move focus to the next input box if not the last box
    if (index < newValues.length - 1 && value !== "") {
      // document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index: any, e: any) => {
    if (e.key === "Backspace" && index > 0 && otpValues[index] === "") {
      // Move focus to the previous input box on Backspace
      // document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };
  return (
    <>
      <div className="flex items-center mb-3">
        {otpValues.map((value, index) => (
          <Input
            key={index}
            id={`otp-input-${index}`}
            type="text"
            value={value}
            radius="full"
            onChange={(e) => handleInputChange(index, e.target.value)}
            maxLength={1}
            className={"me-2 p-0"}
            classNames={{
              innerWrapper: [
                "bg-input",
                "rounded-full",
                "flex",
                "items-center",
              ],
              inputWrapper: ["p-0", "border-0", "border", "border-slate-100"],
              input: [
                "text-center",
                "text-lg",
                "font-semibold",
                "placeholder:text-default-700/50 dark:placeholder:text-white/60",
              ],
            }}
            variant="bordered"
            onKeyDown={(e) => handleKeyDown(index, e)}
            color={"primary"}
          />
        ))}
      </div>
    </>
  );
};
