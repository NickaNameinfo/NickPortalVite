import * as React from "react";
import "../style.scss";
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  useDisclosure,
} from "@nextui-org/react";
import { ProductDetail } from "../Product/ProductDetail";

export const GroceryCard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <div className="grid xm:grid-flow-col-1 mm:grid-cols-1 ml:grid-cols-1 sm:grid-cols-2  md:grid-cols-3  lg:grid-cols-3  xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-5 gap-2">
        <Card
          isPressable
          onPress={() => onOpen()}
          className="Storecard pt-3.5 px-3 cursor-pointer"
        >
          <CardBody className="overflow-visible p-0 relative">
            <span className="bg-slate-700 z-50 absolute text-white text-xs font-medium px-2.5 py-1 rounded-ss-xl rounded-ee-xl dark:bg-gray-700 dark:text-gray-300">
              Cod Available
            </span>
            <span className="bg-slate-700 z-50 right-0 absolute text-white text-xs font-medium px-2.5 py-1 rounded-se-xl rounded-es-xl dark:bg-gray-700 dark:text-gray-300">
              15KMsdas
            </span>
            <Image
              isZoomed
              alt="Here no Image"
              shadow="md"
              width="100%"
              radius="lg"
              className="w-full object-cover min-h-[176px]"
              src="https://app.requestly.io/delay/1000/https://nextui.org/images/hero-card-complete.jpeg"
            />
          </CardBody>
          <CardFooter className="p-0">
            <div className="grid grid-cols-1 w-full">
              <div className="font-semibold mt-3 text-sm  TextMaincolor justify-start flex">
                <p className="truncate">
                  {" "}
                  Apple1 - Shimla sam test and developred portal ui
                </p>
              </div>
              <div className="font-normal text-sm mt-2  TextMaincolor justify-start flex">
                4 pcs (Approx. 550 - 640 g)
              </div>
              <div className="w-full flex justify-between mt-3 mb-3">
                <p className="font-normal text-sm  Pricecolor">120 Stocks</p>
                <p className="font-normal text-sm  TextMaincolor">
                  Rs : 124.34
                </p>
              </div>
            </div>
          </CardFooter>
        </Card>
        <Card
          isPressable
          onPress={() => onOpen()}
          className="Storecard pt-3.5 px-3 cursor-pointer"
        >
          <CardBody className="overflow-visible p-0 relative">
            <span className="bg-slate-700 z-50 absolute text-white text-xs font-medium px-2.5 py-1 rounded-ss-xl rounded-ee-xl dark:bg-gray-700 dark:text-gray-300">
              Cod Available
            </span>
            <span className="bg-slate-700 z-50 right-0 absolute text-white text-xs font-medium px-2.5 py-1 rounded-se-xl rounded-es-xl dark:bg-gray-700 dark:text-gray-300">
              15KMsdas
            </span>
            <Image
              isZoomed
              alt="Here no Image"
              shadow="md"
              width="100%"
              radius="lg"
              className="w-full object-cover min-h-[176px]"
              src="https://app.requestly.io/delay/1000/https://nextui.org/images/hero-card-complete.jpeg"
            />
          </CardBody>
          <CardFooter className="p-0">
            <div className="grid grid-cols-1 w-full">
              <div className="font-semibold mt-3 text-sm  TextMaincolor justify-start flex">
                <p className="truncate">
                  {" "}
                  Apple1 - Shimla sam test and developred portal ui
                </p>
              </div>
              <div className="font-normal text-sm mt-2  TextMaincolor justify-start flex">
                4 pcs (Approx. 550 - 640 g)
              </div>
              <div className="w-full flex justify-between mt-3 mb-3">
                <p className="font-normal text-sm  Pricecolor">120 Stocks</p>
                <p className="font-normal text-sm  TextMaincolor">
                  Rs : 124.34
                </p>
              </div>
            </div>
          </CardFooter>
        </Card>
        <Card
          isPressable
          onPress={() => onOpen()}
          className="Storecard pt-3.5 px-3 cursor-pointer"
        >
          <CardBody className="overflow-visible p-0 relative">
            <span className="bg-slate-700 z-50 absolute text-white text-xs font-medium px-2.5 py-1 rounded-ss-xl rounded-ee-xl dark:bg-gray-700 dark:text-gray-300">
              Cod Available
            </span>
            <span className="bg-slate-700 z-50 right-0 absolute text-white text-xs font-medium px-2.5 py-1 rounded-se-xl rounded-es-xl dark:bg-gray-700 dark:text-gray-300">
              15KMsdas
            </span>
            <Image
              isZoomed
              alt="Here no Image"
              shadow="md"
              width="100%"
              radius="lg"
              className="w-full object-cover min-h-[176px]"
              src="https://app.requestly.io/delay/1000/https://nextui.org/images/hero-card-complete.jpeg"
            />
          </CardBody>
          <CardFooter className="p-0">
            <div className="grid grid-cols-1 w-full">
              <div className="font-semibold mt-3 text-sm  TextMaincolor justify-start flex">
                <p className="truncate">
                  {" "}
                  Apple1 - Shimla sam test and developred portal ui
                </p>
              </div>
              <div className="font-normal text-sm mt-2  TextMaincolor justify-start flex">
                4 pcs (Approx. 550 - 640 g)
              </div>
              <div className="w-full flex justify-between mt-3 mb-3">
                <p className="font-normal text-sm  Pricecolor">120 Stocks</p>
                <p className="font-normal text-sm  TextMaincolor">
                  Rs : 124.34
                </p>
              </div>
            </div>
          </CardFooter>
        </Card>
        <Card
          isPressable
          onPress={() => onOpen()}
          className="Storecard pt-3.5 px-3 cursor-pointer"
        >
          <CardBody className="overflow-visible p-0 relative">
            <span className="bg-slate-700 z-50 absolute text-white text-xs font-medium px-2.5 py-1 rounded-ss-xl rounded-ee-xl dark:bg-gray-700 dark:text-gray-300">
              Cod Available
            </span>
            <span className="bg-slate-700 z-50 right-0 absolute text-white text-xs font-medium px-2.5 py-1 rounded-se-xl rounded-es-xl dark:bg-gray-700 dark:text-gray-300">
              15KMsdas
            </span>
            <Image
              isZoomed
              alt="Here no Image"
              shadow="md"
              width="100%"
              radius="lg"
              className="w-full object-cover min-h-[176px]"
              src="https://app.requestly.io/delay/1000/https://nextui.org/images/hero-card-complete.jpeg"
            />
          </CardBody>
          <CardFooter className="p-0">
            <div className="grid grid-cols-1 w-full">
              <div className="font-semibold mt-3 text-sm  TextMaincolor justify-start flex">
                <p className="truncate">
                  {" "}
                  Apple1 - Shimla sam test and developred portal ui
                </p>
              </div>
              <div className="font-normal text-sm mt-2  TextMaincolor justify-start flex">
                4 pcs (Approx. 550 - 640 g)
              </div>
              <div className="w-full flex justify-between mt-3 mb-3">
                <p className="font-normal text-sm  Pricecolor">120 Stocks</p>
                <p className="font-normal text-sm  TextMaincolor">
                  Rs : 124.34
                </p>
              </div>
            </div>
          </CardFooter>
        </Card>
        <Card
          isPressable
          onPress={() => onOpen()}
          className="Storecard pt-3.5 px-3 cursor-pointer"
        >
          <CardBody className="overflow-visible p-0 relative">
            <span className="bg-slate-700 z-50 absolute text-white text-xs font-medium px-2.5 py-1 rounded-ss-xl rounded-ee-xl dark:bg-gray-700 dark:text-gray-300">
              Cod Available
            </span>
            <span className="bg-slate-700 z-50 right-0 absolute text-white text-xs font-medium px-2.5 py-1 rounded-se-xl rounded-es-xl dark:bg-gray-700 dark:text-gray-300">
              15KMsdas
            </span>
            <Image
              isZoomed
              alt="Here no Image"
              shadow="md"
              width="100%"
              radius="lg"
              className="w-full object-cover min-h-[176px]"
              src="https://app.requestly.io/delay/1000/https://nextui.org/images/hero-card-complete.jpeg"
            />
          </CardBody>
          <CardFooter className="p-0">
            <div className="grid grid-cols-1 w-full">
              <div className="font-semibold mt-3 text-sm  TextMaincolor justify-start flex">
                <p className="truncate">
                  {" "}
                  Apple1 - Shimla sam test and developred portal ui
                </p>
              </div>
              <div className="font-normal text-sm mt-2  TextMaincolor justify-start flex">
                4 pcs (Approx. 550 - 640 g)
              </div>
              <div className="w-full flex justify-between mt-3 mb-3">
                <p className="font-normal text-sm  Pricecolor">120 Stocks</p>
                <p className="font-normal text-sm  TextMaincolor">
                  Rs : 124.34
                </p>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
      <ProductDetail isOpen={isOpen} onClose={onClose} />
    </>
  );
};
export default GroceryCard;
