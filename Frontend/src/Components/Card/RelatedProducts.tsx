import * as React from "react";
import "../style.scss";
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  useDisclosure,
} from "@nextui-org/react";
import { ProductDetail } from "../DetailsModales/ProductDetail";
import { infoData } from "../../configData";
import { useAppDispatch } from "../Common/hooks";
import { onUpdateProductDetailsModal } from "../Common/globalSlice";

export const RelatedProducts = ({
  item = null,
  key = null,
  isHideImage = false,
  from = null,
  popOverOnClose = null,
}) => {
  const dispatch = useAppDispatch();

  return (
    <>
      <Card
        isPressable
        onPress={() => {
          dispatch(
            onUpdateProductDetailsModal({
              isOpen: true,
              item: item,
            })
          );
        }}
        className="Storecard pt-3.5 px-3 cursor-pointer"
      >
        {!isHideImage && (
          <CardBody className="overflow-visible p-0 relative">
            <span className="bg-slate-700 z-50 absolute text-white text-xs font-medium px-2.5 py-1 rounded-ss-xl rounded-ee-xl dark:bg-gray-700 dark:text-gray-300">
              Available
            </span>
            <span className="bg-danger bottom-0 z-50 right-0 absolute text-white text-xs font-medium px-2.5 py-1 rounded-se-xl rounded-es-xl dark:bg-gray-700 dark:text-gray-300">
              Online Order Not Available
            </span>
            <Image
              isZoomed
              alt="Here no Image"
              shadow="md"
              width="100%"
              radius="lg"
              className={`w-full object-cover  ${from !== "ProductView"
                  ? "min-h-[176px] max-h-[176px]"
                  : "min-h-[50px] max-h-[100px]"
                }`}
              src={`${item?.product?.photo ? item?.product?.photo : item?.photo
                }`}
            />
          </CardBody>
        )}
        <CardFooter className="p-0">
          <div className="grid grid-cols-1 w-full">
            <div className="font-semibold mt-3 text-sm  TextMaincolor justify-start flex">
              <p className="truncate">
                {item?.product?.name ? item?.product?.name : item?.name}
              </p>
            </div>
            <div className="font-normal text-sm mt-2  TextMaincolor justify-start flex">
              4 pcs (Approx. 550 - 640 g)
            </div>
            <div className="w-full flex justify-between mt-3 mb-3">
              <p className="font-normal text-sm  Pricecolor">
                {item?.unitSize} Stocks
              </p>
              <p className="font-normal text-sm  TextMaincolor">
                Rs : {item?.price}
              </p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};
export default RelatedProducts;
