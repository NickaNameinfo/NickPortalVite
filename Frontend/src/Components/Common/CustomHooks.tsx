import { useState } from "react";
import { setCookie } from "../../JsFiles/CommonFunction.mjs";

export const useBoolean = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);
  const toggle = () => setValue((prevValue) => !prevValue);

  return [value, setTrue, setFalse, toggle];
};

export const authenticate = (user, next) => {
  console.log(user, "user4352345");
  if (typeof window !== "undefined") {
    setCookie("token", user.token, 60);
    setCookie("role", user.role, 60);
    setCookie("id", user.id, 60);
    setCookie("vendorId", user?.data?.vendorId, 60);
    setCookie("storeId", user?.data?.storeId, 60);
    setCookie("plan", user?.data?.plan, 60);
    next();
  }
};
