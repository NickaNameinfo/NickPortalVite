import * as React from "react";
import "../style.scss";
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  useDisclosure,
} from "@nextui-org/react";
import { infoData } from "../../configData";

export const RelatedVendors = ({ item = null }) => {
  return (
    <>
      <Card isPressable className="Storecard pt-3.5 px-3 cursor-pointer">
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
            src={`${infoData?.baseApi}/${item?.product?.photo}`}
          />
        </CardBody>
        <CardFooter className="p-0">
          <div className="grid grid-cols-1 w-full">
            <div className="font-semibold mt-3 text-sm  TextMaincolor justify-start flex">
              <p className="truncate">{item?.product?.name}</p>
            </div>
            <div className="font-normal text-sm mt-2  TextMaincolor justify-start flex">
              {item?.product?.sortDesc}
            </div>
            <div className="w-full flex justify-between mt-3 mb-3">
              <p className="font-normal text-sm  Pricecolor">
                Price : {item?.price}
              </p>
              <p className="font-normal text-sm  TextMaincolor">
                Quanity : {item?.unitSize}
              </p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};
export default RelatedVendors;
