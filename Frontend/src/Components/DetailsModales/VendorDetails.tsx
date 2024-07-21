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
import { IconHeart, IconLocation, IconShare, IconTick } from "../Icons";
import { BuyCard } from "../Card/BuyCard";
import { IconNxt, IconPrv } from "../../Icons";
import { useGetVendorsByIdQuery } from "../../views/pages/Vendor/Service.mjs";
import RelatedVendors from "../Card/RelatedVendors";

interface VendorDetailsProps {
  isOpen: any;
  onClose: any;
  id: any;
}

export const VendorDetails = (props: VendorDetailsProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, error, refetch } = useGetVendorsByIdQuery(props.id);
  console.log(data?.data, "propsdata");

  React.useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      <Modal
        size={"5xl"}
        isOpen={props.isOpen}
        onClose={props.onClose}
        placement="bottom"
        scrollBehavior="inside"
        backdrop="opaque"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {/* Vendor Detail */}
              </ModalHeader>
              <ModalBody className="p-2">
                <div className="grid xm:grid-cols-2 mm:grid-cols-2  sm:grid-cols-2 ml:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-3 gap-4">
                  <div className="">
                    <Card className="p-2 bg-default/40 mm:w-full ml:w-full">
                      <CardBody className="overflow-visible p-0 relative">
                        <span className="bg-slate-700 z-50 absolute text-white text-xs font-medium px-2.5 py-1 rounded-ss-xl rounded-ee-xl dark:bg-gray-700 dark:text-gray-300">
                          50%
                        </span>
                        <Image
                          alt="Card background"
                          src="https://app.requestly.io/delay/1000/https://nextui.org/images/hero-card-complete.jpeg"
                          shadow="md"
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
                        Fresho Onion (Loose), 5 kg test sam and developed
                      </h2>
                      <p className="text-slate-300 text-lg line-through font-normal">
                        MRP:Rs 151.32
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-black text-lg font-normal">
                          Price:Rs 115 (1/kg)
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
                            >
                              -
                            </Button>
                            <p className="bg-gray-100 text-sm font-semibold p-0 m-0">
                              133
                            </p>
                            <Button
                              className="bg-gray-100 p-0 m-0 text-base font-semibold xm:h-unit-8 xm:px-4 lg:px-3"
                              radius="full"
                              isIconOnly
                              size={"md"}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        <div className="">
                          <Button
                            className="xm:h-unit-8 xm:px-4 lg:px-3 lg:h-unit-xl"
                            radius="lg"
                            size={"md"}
                            color="primary"
                          >
                            Add Cart
                          </Button>
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
                            <IconTick fill="#49A84C" />
                          </div>
                          <div className="flex items-center justify-between pb-2.5">
                            <p className="text-sm font-normal">
                              Online Payment
                            </p>
                            <IconTick fill="#49A84C" />
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-normal">
                              Cash On Delivery
                            </p>
                            <IconTick fill="#E6E6E6" />
                          </div>
                        </div>
                        <div className="col-span-4 ms-4 flex flex-col justify-between h-full">
                          <div className="flex items-center justify-end ">
                            <div className="flex gap-5 items-center">
                              <Button
                                size="sm"
                                isIconOnly
                                aria-label="Like"
                                color="primary"
                                variant="bordered"
                              >
                                <IconLocation fill="#4C86F9" />
                              </Button>
                              <Button
                                size="sm"
                                color="success"
                                variant="bordered"
                                isIconOnly
                              >
                                <IconShare fill="#49A84C" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-end mb-1.5">
                            <div className="flex gap-5 items-center">
                              <Button
                                size="sm"
                                isIconOnly
                                aria-label="Like"
                                color="danger"
                                variant="bordered"
                              >
                                <IconHeart fill="#FF0000" />
                              </Button>
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
                  <div className="flex xl:order-3 lg:order-3 mm:justify-center ml:justify-center md:items-center xm:items-center mm:items-center ml:items-center">
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

                <div className=" sm:px-2 mt-3 flex justify-between items-center ">
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
                      <IconPrv fill="#000000" />
                    </Button>
                    <Button
                      className=" bg-gray-200"
                      size="md"
                      isIconOnly
                      aria-label="Like"
                      variant="bordered"
                    >
                      <IconNxt fill="#000000" />
                    </Button>
                  </div>
                </div>
                <RelatedVendors />
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
