import React from "react";
import PropTypes from "prop-types";
import { Input } from "@nextui-org/react";

const InputNextUI = ({
  classNames,
  isRequired,
  autoFocus,
  label,
  labelPlacement,
  color,
  variant,
  ...props
}) => {
  // Merge custom classNames with default classNames
  const combinedClassNames = {
    ...classNames,
    input: [
      ...(classNames?.input || []),
      "placeholder:text-white/20 dark:placeholder:text-white/20",
    ].join(" "),
  };

  return (
    <div className="input-container">
      {label && labelPlacement === "inside" && (
        <label className="input-label">{label}</label>
      )}
      <Input
        className={combinedClassNames.input}
        required={isRequired}
        autoFocus={autoFocus}
        aria-label={label}
        {...props} // Pass down any other props
      />
    </div>
  );
};

InputNextUI.propTypes = {
  classNames: PropTypes.object,
  isRequired: PropTypes.bool,
  autoFocus: PropTypes.bool,
  label: PropTypes.string,
  labelPlacement: PropTypes.string,
  color: PropTypes.string,
  variant: PropTypes.string,
};

InputNextUI.defaultProps = {
  classNames: {
    input: [],
  },
  isRequired: false,
  autoFocus: false,
  label: "Defualt Value",
  labelPlacement: "inside",
  color: "default",
  variant: "faded",
};

export default InputNextUI;
