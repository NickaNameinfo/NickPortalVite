"use client";
import * as React from "react";
import "../style.scss";
import { Card, CardBody, Image, useDisclosure } from "@nextui-org/react";
import { StoreList } from "./StoreList";

export const CompanyCard = () => {
  return (
    <div className="grid mm:grid-cols-2 ml:grid-cols-2 sm:grid-cols-4  md:grid-cols-4  lg:grid-cols-5  xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 gap-2 mt-2">
      <Card className=" Storecard" isPressable>
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
      <Card className=" Storecard" isPressable>
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
      <Card className=" Storecard" isPressable>
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
      <Card className=" Storecard" isPressable>
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
      <Card className=" Storecard" isPressable>
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
      <Card className=" Storecard" isPressable>
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
      <Card className=" Storecard" isPressable>
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
      <Card className=" Storecard" isPressable>
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
      <Card className=" Storecard" isPressable>
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
    </div>
  );
};
export default CompanyCard;
