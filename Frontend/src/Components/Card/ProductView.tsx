"use client";
import * as React from "react";
import "../style.scss";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@nextui-org/react";
import { StoreList } from "./StoreList";
import { useGetProductsByIdQuery } from "../../views/pages/Product/Service.mjs";
import {
  IconCall,
  IconMap,
  IconMapRound,
  IconsEye,
  IconStar,
  IconstoreCardNext,
  Iconwhatsup,
} from "../../Icons";
import { Link, useNavigate } from "react-router-dom";
import { infoData } from "../../configData";
import { getCookie } from "../../JsFiles/CommonFunction.mjs";
import PremiumCard from "./PremiumCard";
import RelatedProducts from "./RelatedProducts";
import {
  useGetStoresByIdQuery,
  useGetStoresProductByIDQuery,
} from "../../views/pages/Store/Service.mjs";
import { useAppDispatch, useAppSelector } from "../Common/hooks";
export const ProductViewCard = ({ item = null }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  const isProductDetailsModalOpen = useAppSelector(
    (state) => state.globalConfig.isProductDetailsModalOpen
  );

  const isOpenCartModal = useAppSelector(
    (state) => state.globalConfig.isOpenCartModal
  );

  const navigate = useNavigate();

  const { data, error, refetch } = useGetStoresByIdQuery(
    Number(item?.createdId), { skip: !item?.createdId }
  );

  const {
    data: storeProduct,
    error: storeProductError,
    refetch: storeProductRefetch,
  } = useGetStoresProductByIDQuery(Number(data?.data?.id), { skip: !data?.data?.id });


  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typically md breakpoint
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    if (isProductDetailsModalOpen?.isOpen || isOpenCartModal) {
      setIsOpen(false);
    }
  }, [isProductDetailsModalOpen, isOpenCartModal]);

  return (
    <Popover
      showArrow
      placement={isMobile ? "bottom" : "right"}
      key={item?.id}
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!isProductDetailsModalOpen?.isOpen) {
          setIsOpen(true);
        }
      }}
      onClose={() => setIsOpen(false)}
    >
      <PopoverTrigger>
        <Card key={item?.id} className="Storecard py-2.5 px-2.5">
          <CardBody className="overflow-visible p-0 relative">
            <span className="bg-slate-700 z-50 absolute text-white text-xs font-medium px-2.5 py-1 rounded-ss-xl rounded-ee-xl dark:bg-gray-700 dark:text-gray-300">
              {item?.discount} %
            </span>
            <Image
              alt="Here no Image"
              shadow="md"
              width={250}
              radius="lg"
              className="w-full object-contain min-h-[176px] max-h-[176px]"
              src={`${item?.photo}`}
              height={250}
            />
          </CardBody>
        </Card>
      </PopoverTrigger>
      <PopoverContent>
        <div className="max-w-[500px]">
          <div
            className="text-small font-bold text-center p-2.5"
            style={{ borderBottom: "1px solid #EFEFEF" }}
          >
            Store Details : {data?.data?.storename}
          </div>
          <div className="px-1 md:flex">
            <div className="w-[50%]">
              {Number(item?.isEnableEcommerce) === 1 ? (
                <PremiumCard item={item} isHideImage={false} from="ProductView" />
              ) : (
                <RelatedProducts
                  item={item}
                  isHideImage={false}
                  from="ProductView"
                  lineHeight={2}
                />
              )}
            </div>
            <Card className="ps-1 Storecard p-0 outline-none shadow-none max-w-[380px] ml-2">
              <CardBody className="overflow-visible pt-2 pb-3.5 ps-2 pe-2">
                <div className="grid grid-cols-12">
                  <div className="col-span-12">
                    <Image
                      isZoomed
                      shadow="md"
                      width="100%"
                      radius="lg"
                      className="w-full object-contain h-[112px]"
                      alt="Card background"
                      src={`${data?.data?.storeImage}`}
                    />
                  </div>
                  <div className="col-span-12 ps-3 mt-2">
                    <div className="flex items-center">
                      <h2 className="font-medium text-sm TextMaincolor">
                        Open :
                      </h2>
                      <p className="font-normal text-xs StortimingColor tracking-tight ps-2">
                        {data?.data?.openTime} AM - {data?.data?.closeTime} PM
                      </p>
                    </div>
                    <div className="flex flex-row mt-1">
                      <div className="flex  justify-between basis-9/12  items-center">
                        <p className="cursor-pointer pe-1">
                          <Link
                            to={`https://api.whatsapp.com/send?phone=+91${data?.data?.phone}&&text=Hello`}
                            target="_blank"
                          >
                            <Iconwhatsup fill="#6942CB" />
                          </Link>
                        </p>
                        <a href={`tel:+91${data?.data?.phone}`}>
                          <Button
                            className="bgnone p-0 m-0"
                            radius="full"
                            isIconOnly
                            size="sm"
                          >
                            <IconCall fill="#6942CB" />
                          </Button>
                        </a>
                        <a href={data?.data?.location} target="_blank">
                          <Button
                            className="bgnone p-0 m-0"
                            radius="full"
                            isIconOnly
                            size="sm"
                          >
                            <IconMap fill="#6942CB" />
                          </Button>
                        </a>
                        <Link to={data?.data?.website} target="_blank">
                          <Button
                            className="bgnone p-0 m-0"
                            radius="full"
                            isIconOnly
                            size="sm"
                          >
                            <IconMapRound fill="#6942CB" />
                          </Button>
                        </Link>
                      </div>

                      <div className="mt-0 basis-3/12 justify-end flex pe-0">
                        <div className="iconbox flex items-center justify-center cursor-pointer">
                          <Button
                            radius="full"
                            isIconOnly
                            size="sm"
                            className="iconboxProduct"
                            onClick={() =>
                              navigate(`/Store/StoreDetails/${data?.data?.id}`)
                            }
                          >
                            <IconstoreCardNext fill="#ffffff" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="font-normal text-sm  TextMaincolor">
                        Products :{" "}
                        {storeProduct?.data?.length
                          ? storeProduct?.data?.length
                          : 0}
                      </div>

                      <div className="flex items-center">
                        <p className="">
                          <IconStar fill="#FF9900" />
                        </p>
                        <p className="font-normal text-sm mt-1 ps-2 StortimingColor">
                          4.3
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default ProductViewCard;
