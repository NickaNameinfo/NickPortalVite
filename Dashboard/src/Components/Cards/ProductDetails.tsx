import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Image,
} from "@nextui-org/react";
import React from "react";
import {
  IconHeart,
  IconInfo,
  IconLocation,
  IconMapRound,
  IconNext,
  IconPrev,
  IconShare,
  IconTick,
  ModalCloseIcon,
} from "../Icons";
import { useGetVendorsByIdQuery } from "../../views/VendorProducts/Service.mjs";
import { infoData } from "../../configData";
import RelatedVendors from "./RelatedVendors";
import { getCookie } from "../../JsFiles/CommonFunction.mjs";
import { useGetVendorsQuery } from "../../views/vendors/Service.mjs";
import VendorCard from "./VendorCard";
import {
  useAddCartMutation,
  useGetCartByProductIdQuery,
  useUpdateCartMutation,
} from "../../views/VendorProducts/Service.mjs";
import { BuyCard } from "./BuyCard";
import { useAppDispatch, useAppSelector } from "../../Common/hooks";
import { onRefreshCart } from "../../Common/globalSlice";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";

interface VendorDetailsProps {
  isOpen: any;
  onClose: any;
  item: any;
}

export const ProductDetails = (props: VendorDetailsProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const onRefresh = useAppSelector((state) => state.globalConfig.onRefreshCart);
  const notify = (value) => toast(value);
  const id = getCookie("id");
  const {
    data: vendors,
    error: vendorsError,
    refetch: vendorRefetch,
  } = useGetVendorsQuery();
  const {
    data: storeDetails,
    error,
    refetch,
  } = useGetVendorsByIdQuery(Number(props?.item?.supplierId));
  let productId = {
    id: id,
    productId: props?.item?.product?.id,
  };
  const {
    data: cart,
    error: cartError,
    refetch: cartRefetch,
  } = useGetCartByProductIdQuery(productId);
  const [addCart] = useAddCartMutation();
  const [updateCart] = useUpdateCartMutation();
  const dispatch = useAppDispatch();

  console.log(storeDetails, "data80980980");

  React.useEffect(() => {
    onRefresh && dispatch(onRefreshCart(false));
    refetch();
    vendorRefetch();
  }, [onRefresh]);

  const handleAddCart = async (type) => {
    let tempCartValue = {
      productId: props?.item?.product?.id,
      name: props?.item?.product?.name,
      orderId: id,
      price: Number(props?.item?.price),
      total: Number(cart?.data?.qty) * Number(props?.item?.price),
      qty: cart?.data?.qty
        ? type === "add"
          ? Number(cart?.data?.qty) + 1
          : Number(cart?.data?.qty) - 1
        : 1,
      photo: props?.item?.product?.photo,
    };
    if (cart?.data) {
      try {
        const result = await updateCart(tempCartValue);
        if (result) {
          cartRefetch();
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const result = await addCart(tempCartValue);
        if (result) {
          cartRefetch();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleShare = () => {
    const url = window.location.href; // Get the current URL
    navigator.clipboard
      .writeText(url)
      .then(() => {
        notify("URL copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy the URL: ", err);
      });
  };

  return (
    <>
      <Modal
        size={"5xl"}
        isOpen={props.isOpen}
        onClose={props.onClose}
        placement="bottom"
        scrollBehavior="inside"
        backdrop="opaque"
        classNames={{
          closeButton: "modalIconClose",
        }}
        closeButton={<ModalCloseIcon />}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="p-5">
                <div className="grid xm:grid-cols-2 mm:grid-cols-2  sm:grid-cols-2 ml:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-3 gap-4">
                  <div className="">
                    <Card className="p-4 bg-default/40 mm:w-full ml:w-full">
                      <CardBody className="overflow-visible p-0 relative">
                        <Image
                          alt="Card background"
                          src={`${infoData.baseApi}/${props?.item?.product?.photo}`}
                          width="100%"
                          radius="lg"
                          className="w-full object-cover md:h-[222px] xm:h-[150px] mm:h-[150px]  ml:h-[150px]"
                        />
                      </CardBody>
                    </Card>
                  </div>
                  <div className="sm:px-2 xl:col-span-1 lg:col-span-1 md:order-3 xm:order-3 mm:order-3 ml:order-3 md:col-span-2 xm:col-span-2 mm:col-span-2 ml:col-span-2 ">
                    <div className="">
                      <h2 className="text-xl truncate font-bold">
                        {props?.item?.product?.name}
                      </h2>
                      <p className="text-slate-300 text-lg line-through font-normal">
                        Rs : {props?.item?.price}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-black text-lg font-normal">
                          Rs: {props?.item?.price} ({props?.item?.unitSize})
                        </p>
                        <div className="text-sm">120 Stocks</div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="">
                          <div className="flex justify-between items-center rounded-xl bg-gray-100 lg:h-unit-xl">
                            <Button
                              className="bg-gray-100 p-0 m-0 text-base font-semibold xm:h-unit-8 xm:px-4 lg:px-3"
                              radius="full"
                              isIconOnly
                              size="md"
                              onClick={() => handleAddCart("remove")}
                            >
                              -
                            </Button>
                            <p className="bg-gray-100 text-sm font-semibold p-0 m-0">
                              {cart?.data?.qty ? cart?.data?.qty : 0}
                            </p>
                            <Button
                              className="bg-gray-100 p-0 m-0 text-base font-semibold xm:h-unit-8 xm:px-4 lg:px-3"
                              radius="full"
                              isIconOnly
                              size={"md"}
                              onClick={() => handleAddCart("add")}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        <div className="">
                          <Button
                            className="xm:h-unit-8 xm:px-4 lg:px-3 lg:h-unit-xl"
                            color="primary"
                            variant="ghost"
                            radius="lg"
                            size={"md"}
                            onClick={() => onOpen()}
                          >
                            View Cart
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-12 justify-between items-center mt-4">
                        <div className="col-span-8">
                          <div className="flex items-center justify-between pb-2.5">
                            <p className="text-sm font-normal">Per Order</p>
                            <IconTick
                              fill={
                                props?.item?.product?.paymentMode?.includes("1")
                                  ? "#49A84C"
                                  : "#E6E6E6"
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between pb-2.5">
                            <p className="text-sm font-normal">
                              Online Payment
                            </p>
                            <IconTick
                              fill={
                                props?.item?.product?.paymentMode?.includes("1")
                                  ? "#49A84C"
                                  : "#E6E6E6"
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-normal">
                              Cash On Delivery
                            </p>
                            <IconTick
                              fill={
                                props?.item?.product?.paymentMode?.includes("1")
                                  ? "#49A84C"
                                  : "#E6E6E6"
                              }
                            />
                          </div>
                        </div>
                        <div className="col-span-4 ms-4 flex flex-col justify-between h-full">
                          <div className="flex items-center justify-end ">
                            <div className="flex gap-5 items-center">
                              <Link to={storeDetails?.location} target="_blank">
                                <Button
                                  size="sm"
                                  isIconOnly
                                  aria-label="Like"
                                  color="primary"
                                  variant="bordered"
                                >
                                  <IconLocation fill="#4C86F9" />
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                color="success"
                                variant="bordered"
                                isIconOnly
                                onClick={() => handleShare()}
                              >
                                <IconShare fill="#49A84C" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-end mb-1.5">
                            <div className="flex gap-5 items-center">
                              <Link to={storeDetails?.website} target="_blank">
                                <Button
                                  size="sm"
                                  isIconOnly
                                  aria-label="Like"
                                  color="danger"
                                  variant="bordered"
                                >
                                  <IconMapRound fill="#FF0000" />
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                color="danger"
                                variant="bordered"
                                isIconOnly
                              >
                                <IconHeart fill="#FF0000" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex xl:order-3 lg:order-3">
                    <div className="relative mm:w-10/12 ml:w-10/12 ">
                      <span className="bg-red z-50 right-0 absolute text-white text-xs font-medium px-2.5 py-1 rounded-se-xl rounded-es-xl dark:bg-gray-700 dark:text-gray-300">
                        Ad
                      </span>
                      <Image
                        isZoomed
                        className="w-full object-cover md:h-[222px] xm:h-[150px] mm:h-[145px] ml:h-[145px]"
                        height={300}
                        alt="Here no Image"
                        src="https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:px-2 mt-3 flex justify-between items-center ">
                  <div className="font-semibold md:text-xl xm:text-md">
                    Related Vendors
                  </div>
                  <div className="flex flex  items-center">
                    <Button
                      className="bg-gray-200 me-5"
                      size="md"
                      isIconOnly
                      aria-label="Like"
                      variant="bordered"
                    >
                      <IconPrev fill="#000000" />
                    </Button>
                    <Button
                      className=" bg-gray-200"
                      size="md"
                      isIconOnly
                      aria-label="Like"
                      variant="bordered"
                    >
                      <IconNext fill="#000000" />
                    </Button>
                  </div>
                </div>
                <div className="grid xm:grid-cols-1 mm:grid-cols-1 ml:grid-cols-1 sm:grid-cols-2  md:grid-cols-2  lg:grid-cols-2  xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-4 gap-2">
                  {vendors?.data?.map((item, index) => {
                    return <VendorCard item={item} key={index} />;
                  })}
                </div>
              </ModalBody>
              <ModalFooter className="pt-0 p-3 flex justify-between"></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <BuyCard isOpen={isOpen} onClose={onClose} />
    </>
  );
};
