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
export const ProductViewCard = ({ item = null }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const { data, error, refetch } = useGetStoresByIdQuery(
    Number(item?.createdId)
  );
  const {
    data: storeProduct,
    error: storeProductError,
    refetch: storeProductRefetch,
  } = useGetStoresProductByIDQuery(Number(data?.data?.id));
  const currentPlan = getCookie("plan");
  console.log(currentPlan, "currentASDFSAFSDFPlan");
  return (
    <Popover showArrow placement="right" key={item?.id}>
      <PopoverTrigger>
        <Card
          key={item?.id}
          onPress={() => {
            onOpen();
          }}
          className="Storecard py-2.5 px-2.5"
          isPressable
        >
          <CardBody className="overflow-visible p-0 relative">
            <span className="bg-slate-700 z-50 absolute text-white text-xs font-medium px-2.5 py-1 rounded-ss-xl rounded-ee-xl dark:bg-gray-700 dark:text-gray-300">
              {item?.discount} %
            </span>
            <Image
              alt="Here no Image"
              shadow="md"
              width={250}
              radius="lg"
              className="w-full object-cover min-h-[176px] max-h-[176px]"
              src={`${infoData.baseApi}/${item?.photo}`}
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
          <div className="px-1 flex">
            {currentPlan !== "0" ? (
              <PremiumCard item={item} isHideImage={true} />
            ) : (
              <RelatedProducts item={null} isHideImage={false} />
            )}
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
                      src={`${infoData?.baseApi}/${data?.data?.storeImage}`}
                    />
                  </div>
                  <div className="col-span-12 ps-3">
                    <div className="flex items-center">
                      <h2 className="font-medium text-sm TextMaincolor">
                        Open :
                      </h2>
                      <p className="font-normal text-xs StortimingColor tracking-tight ps-2">
                        {data?.data?.openTime} AM - {data?.data?.closeTime} PM
                      </p>
                    </div>
                    <div className="flex items-center mt-2">
                      <p className="mt-1 ">
                        <IconStar fill="#FF9900" />
                      </p>
                      <p className="font-normal text-sm mt-1 ps-2 StortimingColor">
                        4.3
                      </p>
                    </div>
                    <div className="flex flex-row ">
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
                    <div className="flex">
                      <div className="font-normal text-sm  TextMaincolor w-6/12">
                        Products :{" "}
                        {storeProduct?.data?.length
                          ? storeProduct?.data?.length
                          : 0}
                      </div>
                      <div className="font-normal text-sm  TextMaincolor w-6/12 justify-end flex">
                        Near By : 15 Km
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
