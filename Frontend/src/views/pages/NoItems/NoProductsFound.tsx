import { Image } from "@nextui-org/react";
import React from "react";
import { IconNoProduct, IconNotFoundItem } from "../../../Icons";

export const NoProductsFound = () => {
  return (
    <div className="h-[52vh] flex justify-center items-center">
      <IconNotFoundItem width={"400px"} height={"400px"} />
      {/* <h1 className="text-black font-bold text-center">No Items Found</h1> */}
    </div>
  );
};
