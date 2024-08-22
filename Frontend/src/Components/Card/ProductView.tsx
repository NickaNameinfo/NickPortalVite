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
import { Link } from "react-router-dom";

interface ProductViewCardProps {
  loadData: any[];
}

export const ProductViewCard = (props: ProductViewCardProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProductId, setSelectedProductId] = React.useState(null);

  const { data, error, refetch } = useGetProductsByIdQuery(selectedProductId, {
    skip: !selectedProductId,
  });

  const handleClick = (productId) => {
    setSelectedProductId(productId);
  };
  return (
    <div className="grid  mm:grid-cols-2 ml:grid-cols-2 sm:grid-cols-4  md:grid-cols-4  lg:grid-cols-5  xl:grid-cols-5 2xl:grid-cols-5 3xl:grid-cols-5 gap-2 mt-1">
      {props.loadData?.length > 0 &&
        props.loadData?.map((product, index) => {
          console.log("product", product);

          return (
            <>
              <Popover showArrow placement="right" key={index}>
                <PopoverTrigger>
                  <Card
                    key={index}
                    onPress={() => {
                      onOpen();
                      handleClick(product?.id);
                    }}
                    className="Storecard py-2.5 px-2.5"
                    isPressable
                  >
                    <CardBody className="overflow-visible p-0 relative">
                      <span className="badgeBG-Midtransparent z-50 right-0 absolute text-white text-xs font-medium px-2.5 py-1 rounded-se-xl rounded-es-xl dark:bg-gray-700 dark:text-gray-300">
                        10 Store
                      </span>
                      <Image
                        alt="Here no Image"
                        shadow="md"
                        width={250}
                        radius="lg"
                        className="object-cover"
                        src={product?.productphotos?.[0]?.imgUrl}
                        height={250}
                      />
                    </CardBody>
                  </Card>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="max-w-[290px]">
                    <div
                      className="text-small font-bold text-center p-2.5"
                      style={{ borderBottom: "1px solid #EFEFEF" }}
                    >
                      Store Card
                    </div>
                    <div className="px-1">
                      <Popover placement="right" offset={22} showArrow={false}>
                        <PopoverTrigger>
                          <div
                            className="grid grid-cols-12 justify-between items-center py-2 cursor-pointer"
                            onClick={() => {}}
                          >
                            <div className="col-span-11 whitespace-nowrap overflow-hidden text-ellipsis">
                              Grace Super Markets Grace Super Markets Grace
                              Super Markets
                            </div>
                            <IconsEye fill="#49A84C" />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="p-1">
                          <Card className="ps-1 Storecard p-0 outline-none shadow-none max-w-[380px]">
                            <CardHeader className="pb-0 pt-3 ps-2 flex-col items-start ">
                              <div className="text-small font-semibold text-center pb-2.5 w-full">
                                Groceries Store
                              </div>
                              <div className="flex justify-center w-full">
                                <div
                                  className="w-6/12"
                                  style={{ border: "1px solid #EFEFEF" }}
                                ></div>
                              </div>
                            </CardHeader>
                            <CardBody className="overflow-visible pt-2 pb-3.5 ps-2 pe-2  ">
                              <div className="grid grid-cols-12">
                                <div className="col-span-5">
                                  <Image
                                    isZoomed
                                    shadow="md"
                                    width="100%"
                                    radius="lg"
                                    className="w-full object-cover h-[112px]"
                                    alt="Card background"
                                    src="https://nextui.org/images/hero-card-complete.jpeg"
                                  />
                                </div>
                                <div className="col-span-7 ps-3">
                                  <div className="flex items-center">
                                    <h2 className="font-medium text-sm TextMaincolor">
                                      Open :
                                    </h2>
                                    <p className="font-normal text-xs StortimingColor tracking-tight ps-2">
                                      09: 30am-10:00pm
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
                                        <Iconwhatsup fill="#6942CB" />
                                      </p>
                                      <Button
                                        className="bgnone p-0 m-0"
                                        radius="full"
                                        isIconOnly
                                        size="sm"
                                      >
                                        <IconCall fill="#6942CB" />
                                      </Button>
                                      <Button
                                        className="bgnone p-0 m-0"
                                        radius="full"
                                        isIconOnly
                                        size="sm"
                                      >
                                        <IconMap fill="#6942CB" />
                                      </Button>
                                      <Button
                                        className="bgnone p-0 m-0"
                                        radius="full"
                                        isIconOnly
                                        size="sm"
                                      >
                                        <IconMapRound fill="#6942CB" />
                                      </Button>
                                    </div>

                                    <div className="mt-0 basis-3/12 justify-end flex pe-0">
                                      <div className="iconbox flex items-center justify-center cursor-pointer">
                                        <Link to="/Store/StoreDetails">
                                          <Button
                                            radius="full"
                                            isIconOnly
                                            size="sm"
                                            className="iconboxProduct"
                                          >
                                            <IconstoreCardNext fill="#ffffff" />
                                          </Button>
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex">
                                    <div className="font-normal text-sm  TextMaincolor w-6/12">
                                      Products : 150
                                    </div>
                                    <div className="font-normal text-sm  TextMaincolor w-6/12 justify-end flex">
                                      Near By : 15 Km
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        </PopoverContent>
                      </Popover>

                      <div className="grid grid-cols-12 justify-between items-center py-2">
                        <div className="col-span-11 whitespace-nowrap overflow-hidden text-ellipsis">
                          Grace Super Markets
                        </div>
                        <IconsEye fill="#49A84C" />
                      </div>
                      <div className="grid grid-cols-12 justify-between items-center py-2">
                        <div className="col-span-11 whitespace-nowrap overflow-hidden text-ellipsis">
                          Grace Super Markets
                        </div>
                        <IconsEye fill="#49A84C" />
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </>
          );
        })}
      {/* <StoreList
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSelectedProductId(null);
        }}
      /> */}
    </div>
  );
};
export default ProductViewCard;
