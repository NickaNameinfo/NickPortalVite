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
  const now = new Date();
  if (typeof window !== "undefined") {
    setCookie(
      "token",
      user.token,
      new Date(now.getTime() + 24 * 60 * 60 * 1000)
    );
    setCookie("role", user.role, new Date(now.getTime() + 24 * 60 * 60 * 1000));
    setCookie("id", user.id, new Date(now.getTime() + 24 * 60 * 60 * 1000));
    setCookie(
      "vendorId",
      user?.data?.vendorId,
      new Date(now.getTime() + 24 * 60 * 60 * 1000)
    );
    setCookie(
      "storeId",
      user?.data?.storeId,
      new Date(now.getTime() + 24 * 60 * 60 * 1000)
    );
    setCookie(
      "plan",
      user?.data?.plan,
      new Date(now.getTime() + 24 * 60 * 60 * 1000)
    );
    next();
  }
};
