"use client";
import * as React from "react";
import "../style.scss";
import { Card, CardBody, Image, useDisclosure } from "@nextui-org/react";
import { StoreList } from "./StoreList";
import { useBoolean } from "../Common/CustomHooks";
import { VendorDetails } from "../DetailsModales/VendorDetails";
import { infoData } from "../../configData";

export const VendorCard = ({ item = null }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Card className="Storecard">
        <CardBody className="overflow-visible p-0 relative align-middle justify-evenly p-4">
          {item.vendorImage !== "" || item.vendorImage ? (
            <Image
              isZoomed
              alt="Here no Image"
              width="100%"
              className="w-full object-contain"
              src={`${infoData.baseApi}/${item.vendorImage}`}
            />
          ) : (
            <p className="text-black text-center p-2">{item?.storename}</p>
          )}
        </CardBody>
      </Card>
      {/* <VendorDetails isOpen={isOpen} onClose={onClose} id={item.id} /> */}
    </>
  );
};
export default VendorCard;
