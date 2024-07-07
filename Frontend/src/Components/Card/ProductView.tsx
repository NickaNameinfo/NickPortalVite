"use client";
import * as React from "react";
import "../style.scss";
import { Card, CardBody, Image, useDisclosure } from "@nextui-org/react";
import { StoreList } from "./StoreList";

export const ProductViewCard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div className="grid  mm:grid-cols-2 ml:grid-cols-2 sm:grid-cols-4  md:grid-cols-4  lg:grid-cols-5  xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 gap-2 mt-1">
      <Card
        onPress={() => onOpen()}
        className="Storecard py-2.5 px-2.5"
        isPressable
      >
        <CardBody className="overflow-visible p-0 relative">
          <span className="bg-slate-700 z-50 right-0 absolute text-white text-xs font-medium px-2.5 py-1 rounded-se-xl rounded-es-xl dark:bg-gray-700 dark:text-gray-300">
            10 Store
          </span>
          <Image
            alt="Here no Image"
            shadow="md"
            width="100%"
            radius="lg"
            className="w-full object-cover min-h-[190px]"
            src="https://nextui-docs-v2.vercel.app/images/album-cover.png"
          />
        </CardBody>
      </Card>
      <Card
        onPress={() => onOpen()}
        className="Storecard py-2.5 px-2.5"
        isPressable
      >
        <CardBody className="overflow-visible p-0 relative">
          <span className="bg-slate-700 z-50 right-0 absolute text-white text-xs font-medium px-2.5 py-1 rounded-se-xl rounded-es-xl dark:bg-gray-700 dark:text-gray-300">
            10 Store
          </span>
          <Image
            alt="Here no Image"
            shadow="md"
            width="100%"
            radius="lg"
            className="w-full object-cover min-h-[190px]"
            src="https://nextui-docs-v2.vercel.app/images/album-cover.png"
          />
        </CardBody>
      </Card>
      <Card
        onPress={() => onOpen()}
        className="Storecard py-2.5 px-2.5"
        isPressable
      >
        <CardBody className="overflow-visible p-0 relative">
          <span className="bg-slate-700 z-50 right-0 absolute text-white text-xs font-medium px-2.5 py-1 rounded-se-xl rounded-es-xl dark:bg-gray-700 dark:text-gray-300">
            10 Store
          </span>
          <Image
            alt="Here no Image"
            shadow="md"
            width="100%"
            radius="lg"
            className="w-full object-cover min-h-[190px]"
            src="https://nextui-docs-v2.vercel.app/images/album-cover.png"
          />
        </CardBody>
      </Card>
      <Card
        onPress={() => onOpen()}
        className="Storecard py-2.5 px-2.5"
        isPressable
      >
        <CardBody className="overflow-visible p-0 relative">
          <span className="bg-slate-700 z-50 right-0 absolute text-white text-xs font-medium px-2.5 py-1 rounded-se-xl rounded-es-xl dark:bg-gray-700 dark:text-gray-300">
            10 Store
          </span>
          <Image
            alt="Here no Image"
            shadow="md"
            width="100%"
            radius="lg"
            className="w-full object-cover min-h-[190px]"
            src="https://nextui-docs-v2.vercel.app/images/album-cover.png"
          />
        </CardBody>
      </Card>
      <Card
        onPress={() => onOpen()}
        className="Storecard py-2.5 px-2.5"
        isPressable
      >
        <CardBody className="overflow-visible p-0 relative">
          <span className="bg-slate-700 z-50 right-0 absolute text-white text-xs font-medium px-2.5 py-1 rounded-se-xl rounded-es-xl dark:bg-gray-700 dark:text-gray-300">
            10 Store
          </span>
          <Image
            alt="Here no Image"
            shadow="md"
            width="100%"
            radius="lg"
            className="w-full object-cover min-h-[190px]"
            src="https://nextui-docs-v2.vercel.app/images/album-cover.png"
          />
        </CardBody>
      </Card>
      <Card
        className="Storecard py-2.5 px-2.5"
        isPressable
        onPress={() => onOpen()}
      >
        <CardBody className="overflow-visible p-0 relative">
          <span className="bg-slate-700 z-50 right-0 absolute text-white text-xs font-medium px-2.5 py-1 rounded-se-xl rounded-es-xl dark:bg-gray-700 dark:text-gray-300">
            10 Store
          </span>
          <Image
            alt="Here no Image"
            shadow="md"
            width="100%"
            radius="lg"
            className="w-full object-cover min-h-[190px]"
            src="https://nextui-docs-v2.vercel.app/images/album-cover.png"
          />
        </CardBody>
      </Card>
      <Card
        className="Storecard py-2.5 px-2.5"
        isPressable
        onPress={() => onOpen()}
      >
        <CardBody className="overflow-visible p-0 relative">
          <span className="bg-slate-700 z-50 right-0 absolute text-white text-xs font-medium px-2.5 py-1 rounded-se-xl rounded-es-xl dark:bg-gray-700 dark:text-gray-300">
            10 Store
          </span>
          <Image
            alt="Here no Image"
            shadow="md"
            width="100%"
            radius="lg"
            className="w-full object-cover min-h-[190px]"
            src="https://nextui-docs-v2.vercel.app/images/album-cover.png"
          />
        </CardBody>
      </Card>
      <StoreList isOpen={isOpen} onClose={onClose} />
    </div>
  );
};
export default ProductViewCard;
