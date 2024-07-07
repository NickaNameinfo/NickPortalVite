import * as React from "react";
import "../style.scss";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@nextui-org/react";
import {
  IconHeart,
  IconShopBag,
  IconShoptrolley,
  IconTick,
  IconsEye,
} from "../Icons";
import StoreHeaderCard from "./StoreHeaderCard";
import { ProductDetail } from "../Product/ProductDetail";
import { BuyCard } from "./BuyCard";
import { useBoolean } from "../Common/CustomHooks";

export const PremiumCard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cartPopup, setTrue, setFalse, toggle] = useBoolean(false);

  return (
    <>
      <div className="grid xm:grid-cols-1 mm:grid-cols-1 ml:grid-cols-1 sm:grid-cols-2  md:grid-cols-3  lg:grid-cols-3  xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-5 gap-2">
        <Card className="Storecard pt-3.5 px-3">
          <CardBody className="overflow-visible p-0 relative">
            <span className="bg-slate-700 z-50 absolute text-white text-xs font-medium px-2.5 py-1 rounded-ss-xl rounded-ee-xl dark:bg-gray-700 dark:text-gray-300">
              90%
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
              <div className="font-semibold text-base mt-2 TextMaincolor">
                <p className="truncate">
                  {" "}
                  Apple - Royal Economy sam developed jkjgc
                </p>
              </div>

              <div className="w-full flex justify-between mt-2">
                <p className="font-semibold text-base Pricecolor p-0">
                  Rs : 124.34
                </p>
                <p className="font-normal text-sm  TextMaincolor p-0">
                  120 Stocks
                </p>
              </div>
              <div className="w-full flex justify-between mt-2">
                <p className="font-normal text-sm  Pricecolor TextMaincolor p-0">
                  4 Per Order
                </p>
                <IconTick fill="#49A84C" />
              </div>
              <div className="w-full flex justify-between pt-2">
                <p className="font-normal text-sm  Pricecolor TextMaincolor p-0">
                  Online Payment
                </p>
                <IconTick fill="#49A84C" />
              </div>
              <div className="w-full flex justify-between pt-2 pb-2">
                <p className="font-normal text-sm  Pricecolor TextMaincolor p-0">
                  Online Payment
                </p>
                <IconTick fill="#FFFFFF" />
              </div>
              <div className="w-full flex justify-around pb-3">
                <div className="PrimiumCardFooterBg rounded-lg flex w-full justify-around items-center">
                  <div className="PrimiumCardFooterBg rounded-lg flex w-full justify-around items-center">
                    <Button
                      className="bgnone p-0 m-0"
                      radius="full"
                      isIconOnly
                      size="lg"
                    >
                      <IconHeart
                        fill="#FF0000"
                        className="m-3 cursor-pointer"
                      />
                    </Button>
                    <Button
                      className="bgnone p-0 m-0"
                      radius="full"
                      isIconOnly
                      size="lg"
                      onClick={() => onOpen()}
                    >
                      <IconsEye fill="#CFA007" className="m-3 cursor-pointer" />
                    </Button>
                    <Button
                      className="bgnone p-0 m-0"
                      radius="full"
                      isIconOnly
                      size="lg"
                      onClick={() => setTrue}
                    >
                      <IconShopBag
                        fill="#4C86F9"
                        className="m-3 cursor-pointer"
                      />
                    </Button>

                    <Popover
                      placement="top"
                      showArrow={true}
                      shouldFlip={true}
                      className="p-0 m-0"
                    >
                      <PopoverTrigger>
                        <Button
                          className="bgnone p-0 m-0"
                          radius="full"
                          isIconOnly
                          size="lg"
                        >
                          <IconShoptrolley
                            fill="#49A84C"
                            className="m-3 cursor-pointer"
                          />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="addsub bg-gray-200 ">
                        <div className="flex justify-between items-center">
                          <Button
                            className="bgnone p-0 m-0 text-base font-semibold"
                            radius="full"
                            isIconOnly
                            size="md"
                          >
                            -
                          </Button>
                          <p className="bgnonetext-sm font-semibold px-2 ">845</p>
                          <Button
                            className="bgnone p-0 m-0 text-base font-semibold "
                            radius="full"
                            isIconOnly
                            size="md"
                          >
                            +
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
        <Card className="Storecard pt-3.5 px-3">
          <CardBody className="overflow-visible p-0 relative">
            <span className="bg-slate-700 z-50 absolute text-white text-xs font-medium px-2.5 py-1 rounded-ss-xl rounded-ee-xl dark:bg-gray-700 dark:text-gray-300">
              90%
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
              <div className="font-semibold text-base mt-2 TextMaincolor">
                <p className="truncate">
                  {" "}
                  Apple - Royal Economy sam developed jkjgc
                </p>
              </div>

              <div className="w-full flex justify-between mt-2">
                <p className="font-semibold text-base Pricecolor p-0">
                  Rs : 124.34
                </p>
                <p className="font-normal text-sm  TextMaincolor p-0">
                  120 Stocks
                </p>
              </div>
              <div className="w-full flex justify-between mt-2">
                <p className="font-normal text-sm  Pricecolor TextMaincolor p-0">
                  4 Per Order
                </p>
                <IconTick fill="#49A84C" />
              </div>
              <div className="w-full flex justify-between pt-2">
                <p className="font-normal text-sm  Pricecolor TextMaincolor p-0">
                  Online Payment
                </p>
                <IconTick fill="#49A84C" />
              </div>
              <div className="w-full flex justify-between pt-2 pb-2">
                <p className="font-normal text-sm  Pricecolor TextMaincolor p-0">
                  Online Payment
                </p>
                <IconTick fill="#FFFFFF" />
              </div>
              <div className="w-full flex justify-around pb-3">
                <div className="PrimiumCardFooterBg rounded-lg flex w-full justify-around items-center">
                  <div className="PrimiumCardFooterBg rounded-lg flex w-full justify-around items-center">
                    <Button
                      className="bgnone p-0 m-0"
                      radius="full"
                      isIconOnly
                      size="lg"
                    >
                      <IconHeart
                        fill="#FF0000"
                        className="m-3 cursor-pointer"
                      />
                    </Button>
                    <Button
                      className="bgnone p-0 m-0"
                      radius="full"
                      isIconOnly
                      size="lg"
                      onClick={() => onOpen()}
                    >
                      <IconsEye fill="#CFA007" className="m-3 cursor-pointer" />
                    </Button>
                    <Button
                      className="bgnone p-0 m-0"
                      radius="full"
                      isIconOnly
                      size="lg"
                      onClick={() => setTrue}
                    >
                      <IconShopBag
                        fill="#4C86F9"
                        className="m-3 cursor-pointer"
                      />
                    </Button>

                    <Popover
                      placement="top"
                      showArrow={true}
                      shouldFlip={true}
                      className="p-0 m-0"
                    >
                      <PopoverTrigger>
                        <Button
                          className="bgnone p-0 m-0"
                          radius="full"
                          isIconOnly
                          size="lg"
                        >
                          <IconShoptrolley
                            fill="#49A84C"
                            className="m-3 cursor-pointer"
                          />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="addsub bg-gray-200 ">
                        <div className="flex justify-between items-center">
                          <Button
                            className="bgnone p-0 m-0 text-base font-semibold"
                            radius="full"
                            isIconOnly
                            size="md"
                          >
                            -
                          </Button>
                          <p className="bgnonetext-sm font-semibold px-2 ">845</p>
                          <Button
                            className="bgnone p-0 m-0 text-base font-semibold "
                            radius="full"
                            isIconOnly
                            size="md"
                          >
                            +
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
        <Card className="Storecard pt-3.5 px-3">
          <CardBody className="overflow-visible p-0 relative">
            <span className="bg-slate-700 z-50 absolute text-white text-xs font-medium px-2.5 py-1 rounded-ss-xl rounded-ee-xl dark:bg-gray-700 dark:text-gray-300">
              90%
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
              <div className="font-semibold text-base mt-2 TextMaincolor">
                <p className="truncate">
                  {" "}
                  Apple - Royal Economy sam developed jkjgc
                </p>
              </div>

              <div className="w-full flex justify-between mt-2">
                <p className="font-semibold text-base Pricecolor p-0">
                  Rs : 124.34
                </p>
                <p className="font-normal text-sm  TextMaincolor p-0">
                  120 Stocks
                </p>
              </div>
              <div className="w-full flex justify-between mt-2">
                <p className="font-normal text-sm  Pricecolor TextMaincolor p-0">
                  4 Per Order
                </p>
                <IconTick fill="#49A84C" />
              </div>
              <div className="w-full flex justify-between pt-2">
                <p className="font-normal text-sm  Pricecolor TextMaincolor p-0">
                  Online Payment
                </p>
                <IconTick fill="#49A84C" />
              </div>
              <div className="w-full flex justify-between pt-2 pb-2">
                <p className="font-normal text-sm  Pricecolor TextMaincolor p-0">
                  Online Payment
                </p>
                <IconTick fill="#FFFFFF" />
              </div>
              <div className="w-full flex justify-around pb-3">
                <div className="PrimiumCardFooterBg rounded-lg flex w-full justify-around items-center">
                  <div className="PrimiumCardFooterBg rounded-lg flex w-full justify-around items-center">
                    <Button
                      className="bgnone p-0 m-0"
                      radius="full"
                      isIconOnly
                      size="lg"
                    >
                      <IconHeart
                        fill="#FF0000"
                        className="m-3 cursor-pointer"
                      />
                    </Button>
                    <Button
                      className="bgnone p-0 m-0"
                      radius="full"
                      isIconOnly
                      size="lg"
                      onClick={() => onOpen()}
                    >
                      <IconsEye fill="#CFA007" className="m-3 cursor-pointer" />
                    </Button>
                    <Button
                      className="bgnone p-0 m-0"
                      radius="full"
                      isIconOnly
                      size="lg"
                      onClick={() => setTrue}
                    >
                      <IconShopBag
                        fill="#4C86F9"
                        className="m-3 cursor-pointer"
                      />
                    </Button>

                    <Popover
                      placement="top"
                      showArrow={true}
                      shouldFlip={true}
                      className="p-0 m-0"
                    >
                      <PopoverTrigger>
                        <Button
                          className="bgnone p-0 m-0"
                          radius="full"
                          isIconOnly
                          size="lg"
                        >
                          <IconShoptrolley
                            fill="#49A84C"
                            className="m-3 cursor-pointer"
                          />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="addsub bg-gray-200 ">
                        <div className="flex justify-between items-center">
                          <Button
                            className="bgnone p-0 m-0 text-base font-semibold"
                            radius="full"
                            isIconOnly
                            size="md"
                          >
                            -
                          </Button>
                          <p className="bgnonetext-sm font-semibold px-2 ">835</p>
                          <Button
                            className="bgnone p-0 m-0 text-base font-semibold "
                            radius="full"
                            isIconOnly
                            size="md"
                          >
                            +
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
        <Card className="Storecard pt-3.5 px-3">
          <CardBody className="overflow-visible p-0 relative">
            <span className="bg-slate-700 z-50 absolute text-white text-xs font-medium px-2.5 py-1 rounded-ss-xl rounded-ee-xl dark:bg-gray-700 dark:text-gray-300">
              90%
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
              <div className="font-semibold text-base mt-2 TextMaincolor">
                <p className="truncate">
                  {" "}
                  Apple - Royal Economy sam developed jkjgc
                </p>
              </div>

              <div className="w-full flex justify-between mt-2">
                <p className="font-semibold text-base Pricecolor p-0">
                  Rs : 124.34
                </p>
                <p className="font-normal text-sm  TextMaincolor p-0">
                  120 Stocks
                </p>
              </div>
              <div className="w-full flex justify-between mt-2">
                <p className="font-normal text-sm  Pricecolor TextMaincolor p-0">
                  4 Per Order
                </p>
                <IconTick fill="#49A84C" />
              </div>
              <div className="w-full flex justify-between pt-2">
                <p className="font-normal text-sm  Pricecolor TextMaincolor p-0">
                  Online Payment
                </p>
                <IconTick fill="#49A84C" />
              </div>
              <div className="w-full flex justify-between pt-2 pb-2">
                <p className="font-normal text-sm  Pricecolor TextMaincolor p-0">
                  Online Payment
                </p>
                <IconTick fill="#FFFFFF" />
              </div>
              <div className="w-full flex justify-around pb-3">
                <div className="PrimiumCardFooterBg rounded-lg flex w-full justify-around items-center">
                  <div className="PrimiumCardFooterBg rounded-lg flex w-full justify-around items-center">
                    <Button
                      className="bgnone p-0 m-0"
                      radius="full"
                      isIconOnly
                      size="lg"
                    >
                      <IconHeart
                        fill="#FF0000"
                        className="m-3 cursor-pointer"
                      />
                    </Button>
                    <Button
                      className="bgnone p-0 m-0"
                      radius="full"
                      isIconOnly
                      size="lg"
                      onClick={() => onOpen()}
                    >
                      <IconsEye fill="#CFA007" className="m-3 cursor-pointer" />
                    </Button>
                    <Button
                      className="bgnone p-0 m-0"
                      radius="full"
                      isIconOnly
                      size="lg"
                      onClick={() => setTrue}
                    >
                      <IconShopBag
                        fill="#4C86F9"
                        className="m-3 cursor-pointer"
                      />
                    </Button>

                    <Popover
                      placement="top"
                      showArrow={true}
                      shouldFlip={true}
                      className="p-0 m-0"
                    >
                      <PopoverTrigger>
                        <Button
                          className="bgnone p-0 m-0"
                          radius="full"
                          isIconOnly
                          size="lg"
                        >
                          <IconShoptrolley
                            fill="#49A84C"
                            className="m-3 cursor-pointer"
                          />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="addsub bg-gray-200 ">
                        <div className="flex justify-between items-center">
                          <Button
                            className="bgnone p-0 m-0 text-base font-semibold"
                            radius="full"
                            isIconOnly
                            size="md"
                          >
                            -
                          </Button>
                          <p className="bgnonetext-sm font-semibold px-2 ">853</p>
                          <Button
                            className="bgnone p-0 m-0 text-base font-semibold "
                            radius="full"
                            isIconOnly
                            size="md"
                          >
                            +
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
        <Card className="Storecard pt-3.5 px-3">
          <CardBody className="overflow-visible p-0 relative">
            <span className="bg-slate-700 z-50 absolute text-white text-xs font-medium px-2.5 py-1 rounded-ss-xl rounded-ee-xl dark:bg-gray-700 dark:text-gray-300">
              90%
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
              <div className="font-semibold text-base mt-2 TextMaincolor">
                <p className="truncate">
                  {" "}
                  Apple - Royal Economy sam developed jkjgc
                </p>
              </div>

              <div className="w-full flex justify-between mt-2">
                <p className="font-semibold text-base Pricecolor p-0">
                  Rs : 124.34
                </p>
                <p className="font-normal text-sm  TextMaincolor p-0">
                  120 Stocks
                </p>
              </div>
              <div className="w-full flex justify-between mt-2">
                <p className="font-normal text-sm  Pricecolor TextMaincolor p-0">
                  4 Per Order
                </p>
                <IconTick fill="#49A84C" />
              </div>
              <div className="w-full flex justify-between pt-2">
                <p className="font-normal text-sm  Pricecolor TextMaincolor p-0">
                  Online Payment
                </p>
                <IconTick fill="#49A84C" />
              </div>
              <div className="w-full flex justify-between pt-2 pb-2">
                <p className="font-normal text-sm  Pricecolor TextMaincolor p-0">
                  Online Payment
                </p>
                <IconTick fill="#FFFFFF" />
              </div>
              <div className="w-full flex justify-around pb-3">
                <div className="PrimiumCardFooterBg rounded-lg flex w-full justify-around items-center">
                  <div className="PrimiumCardFooterBg rounded-lg flex w-full justify-around items-center">
                    <Button
                      className="bgnone p-0 m-0"
                      radius="full"
                      isIconOnly
                      size="lg"
                    >
                      <IconHeart
                        fill="#FF0000"
                        className="m-3 cursor-pointer"
                      />
                    </Button>
                    <Button
                      className="bgnone p-0 m-0"
                      radius="full"
                      isIconOnly
                      size="lg"
                      onClick={() => onOpen()}
                    >
                      <IconsEye fill="#CFA007" className="m-3 cursor-pointer" />
                    </Button>
                    <Button
                      className="bgnone p-0 m-0"
                      radius="full"
                      isIconOnly
                      size="lg"
                      onClick={() => setTrue}
                    >
                      <IconShopBag
                        fill="#4C86F9"
                        className="m-3 cursor-pointer"
                      />
                    </Button>

                    <Popover
                      placement="top"
                      showArrow={true}
                      shouldFlip={true}
                      className="p-0 m-0"
                    >
                      <PopoverTrigger>
                        <Button
                          className="bgnone p-0 m-0"
                          radius="full"
                          isIconOnly
                          size="lg"
                        >
                          <IconShoptrolley
                            fill="#49A84C"
                            className="m-3 cursor-pointer"
                          />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="addsub bg-gray-200 ">
                        <div className="flex justify-between items-center">
                          <Button
                            className="bgnone p-0 m-0 text-base font-semibold"
                            radius="full"
                            isIconOnly
                            size="md"
                          >
                            -
                          </Button>
                          <p className="bgnonetext-sm font-semibold px-2 ">844</p>
                          <Button
                            className="bgnone p-0 m-0 text-base font-semibold "
                            radius="full"
                            isIconOnly
                            size="md"
                          >
                            +
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
      <ProductDetail isOpen={isOpen} onClose={onClose} />
      <BuyCard isOpen={cartPopup} onClose={setFalse} />
    </>
  );
};
export default PremiumCard;
