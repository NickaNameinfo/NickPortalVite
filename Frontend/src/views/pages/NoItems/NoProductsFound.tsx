import { Image } from "@nextui-org/react";
import React from "react";
import { IconNoProduct } from "../../../Icons";

export const NoProductsFound = () => {
  return (
    <div className="h-[52vh] flex justify-center items-center">
      <IconNoProduct width={"300px"} height={"300px"} />
      {/* <h1 className="text-black font-bold text-center">No Items Found</h1> */}
    </div>
  );
};
