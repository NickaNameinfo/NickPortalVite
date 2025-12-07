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
  lineHeight = 8,
}) => {

  const dispatch = useAppDispatch();

  // Helper function to get the display price
  const getDisplayPrice = () => {
    const product = item?.product || item;
    
    // If sizeUnitSizeMap exists, use the first size's price
    if (product?.sizeUnitSizeMap) {
      try {
        const parsed = typeof product.sizeUnitSizeMap === 'string' 
          ? JSON.parse(product.sizeUnitSizeMap) 
          : product.sizeUnitSizeMap;
        
        const sizes = Object.keys(parsed);
        if (sizes.length > 0) {
          const firstSize = sizes[0];
          const sizeData = parsed[firstSize];
          const sizePrice = Number(sizeData?.total) || Number(sizeData?.grandTotal) || Number(sizeData?.price) || 0;
          if (sizePrice > 0) {
            return sizePrice;
          }
        }
      } catch (e) {
        console.warn('Failed to parse sizeUnitSizeMap:', e);
      }
    }
    
    // Fallback to product price, then item price
    return Number(product?.total) || Number(product?.price) || Number(item?.price) || 0;
  };

  // Helper function to get the display unit size
  const getDisplayUnitSize = () => {
    const product = item?.product || item;
    
    // If sizeUnitSizeMap exists, use the first size's unitSize
    if (product?.sizeUnitSizeMap) {
      try {
        const parsed = typeof product.sizeUnitSizeMap === 'string' 
          ? JSON.parse(product.sizeUnitSizeMap) 
          : product.sizeUnitSizeMap;
        
        const sizes = Object.keys(parsed);
        if (sizes.length > 0) {
          const firstSize = sizes[0];
          const sizeData = parsed[firstSize];
          if (sizeData?.unitSize) {
            return sizeData.unitSize;
          }
        }
      } catch (e) {
        console.warn('Failed to parse sizeUnitSizeMap:', e);
      }
    }
    
    // Fallback to product unitSize, then item unitSize
    return product?.unitSize || item?.unitSize || item?.quantity || '';
  };

  const displayPrice = getDisplayPrice();
  const displayUnitSize = getDisplayUnitSize();
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
          <CardBody className="overflow-visible p-0">
            <div className="relative">
              <span className="bg-slate-700 z-50 absolute text-white text-xs font-medium px-2.5 py-1 rounded-ss-xl rounded-ee-xl dark:bg-gray-700 dark:text-gray-300">
                Available
              </span>
              <Image
                isZoomed
                alt="Here no Image"
                shadow="md"
                width="100%"
                radius="lg"
                className={`w-full object-contain  ${from !== "ProductView"
                  ? "min-h-[176px] max-h-[176px]"
                  : "min-h-[50px] max-h-[100px]"
                  }`}
                src={`${item?.product?.photo ? item?.product?.photo : item?.photo
                  }`}
              />
              <span className="bg-danger bottom-0 z-50 right-0 absolute text-white text-xs font-medium px-2.5 py-1 rounded-se-xl rounded-es-xl dark:bg-gray-700 dark:text-gray-300">
                Online Order Not Available
              </span>
            </div>
            <div className="font-semibold mt-3 text-sm  TextMaincolor justify-start flex">
              <p>
                {item?.product?.name ? item?.product?.name : item?.name}
              </p>
            </div>

            <div className="font-normal text-sm Pricecolor overflow-hidden text-ellipsis"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: lineHeight,
                WebkitBoxOrient: 'vertical',
              }}>
              {item?.product?.sortDesc ? item?.product?.sortDesc : item?.sortDesc}
            </div>
          </CardBody>
        )}
        <CardFooter className="p-0">
          <div className="grid grid-cols-1 w-full">
            
            <div className="w-full flex justify-between mt-3 mb-3">
              <p className="font-normal text-sm  Pricecolor">
                {displayUnitSize}
              </p>
              <p className="font-normal text-sm  TextMaincolor">
                Rs : {displayPrice}
              </p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};
export default RelatedProducts;
