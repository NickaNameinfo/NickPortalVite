"use client";
import * as React from "react";
import "../style.scss";
import { Card, CardBody, Image, useDisclosure } from "@nextui-org/react";
import { StoreList } from "./StoreList";
import { useBoolean } from "../Common/CustomHooks";
import { VendorDetails } from "../DetailsModales/VendorDetails";

export const CompanyCard = ({ item = null }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Card className=" Storecard" isPressable onClick={() => onOpen()}>
        <CardBody className="overflow-visible p-0 relative">
          <Image
            isZoomed
            alt="Here no Image"
            shadow="md"
            width="100%"
            radius="lg"
            className="w-full object-cover max-h-[190px]"
            src="https://nextui-docs-v2.vercel.app/images/fruit-1.jpeg"
          />
        </CardBody>
      </Card>
      <VendorDetails isOpen={isOpen} onClose={onClose} id={item.id}/>
    </>
  );
};
export default CompanyCard;
