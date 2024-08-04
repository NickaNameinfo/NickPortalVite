import { useState } from "react";

export const useBoolean = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);
  const toggle = () => setValue((prevValue) => !prevValue);

  return [value, setTrue, setFalse, toggle];
};
