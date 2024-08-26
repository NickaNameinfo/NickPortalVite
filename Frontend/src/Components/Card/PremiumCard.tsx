import * as React from "react";
import "../style.scss";
import {
  Badge,
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
import { ProductDetail } from "../DetailsModales/ProductDetail";
import { BuyCard } from "./BuyCard";
import { useBoolean } from "../Common/CustomHooks";
import { useParams } from "react-router-dom";
import {
  useGetCartByProductIdQuery,
  useAddCartMutation,
  useUpdateCartMutation,
} from "../../views/pages/Store/Service.mjs";
import { useAppDispatch, useAppSelector } from "../Common/hooks";
import { onRefreshCart } from "../Common/globalSlice";
import { infoData } from "../../configData";

export const PremiumCard = ({ item = null }) => {
  console.log(item, "item");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: cartIsOpen,
    onOpen: cartOpen,
    onClose: cartClose,
  } = useDisclosure();

  const [cartPopup, setTrue, setFalse, toggle] = useBoolean(false);

  const { id } = useParams();
  console.log(id, "idid");

  const onRefresh = useAppSelector((state) => state.globalConfig.onRefreshCart);
  const [addCart] = useAddCartMutation();
  const [updateCart] = useUpdateCartMutation();
  const dispatch = useAppDispatch();
  let productId = {
    id: id,
    productId: item?.product?.id,
  };
  console.log(productId, "productId");

  const { data, error, refetch } = useGetCartByProductIdQuery(productId);
  console.log(data, "dataklsmfskl");

  React.useEffect(() => {
    onRefresh && dispatch(onRefreshCart(false));
    refetch();
  }, [onRefresh]);

  const handleAddCart = async (type) => {
    let tempCartValue = {
      productId: item?.product?.id,
      name: item?.product?.name,
      orderId: id,
      price: Number(item?.price),
      total: Number(data?.data?.qty) * Number(item?.price),
      qty: data?.data?.qty
        ? type === "add"
          ? Number(data?.data?.qty) + 1
          : Number(data?.data?.qty) - 1
        : 1,
      photo: item?.product?.photo,
    };
    if (data?.data) {
      try {
        const result = await updateCart(tempCartValue);
        if (result) {
          refetch();
          dispatch(onRefreshCart(true));
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const result = await addCart(tempCartValue);
        if (result) {
          refetch();
          dispatch(onRefreshCart(true));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
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
            src={`${infoData?.baseApi}/${item?.product?.photo}`}
          />
        </CardBody>
        <CardFooter className="p-0">
          <div className="grid grid-cols-1 w-full">
            <div className="font-semibold text-base mt-2 TextMaincolor">
              <p className="truncate">{item?.product?.name}</p>
            </div>

            <div className="w-full flex justify-between mt-2">
              <p className="font-semibold text-base Pricecolor p-0">
                Rs : {item?.price}
              </p>
              <p className="font-normal text-sm  TextMaincolor p-0">
                120 Stocks
              </p>
            </div>
            <div className="w-full flex justify-between mt-2">
              <p className="font-normal text-sm  Pricecolor TextMaincolor p-0">
                Per Order
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
              <IconTick fill="#00000" />
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
                    <IconHeart fill="#FF0000" className="m-3 cursor-pointer" />
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
                  <Badge
                    content={data?.data?.qty ? data?.data?.qty : 0}
                    shape="circle"
                    color="danger"
                  >
                    {/* <Button
                      className="bgnone p-0 m-0"
                      radius="full"
                      isIconOnly
                      size="lg"
                      onClick={() => cartOpen()}
                    > */}
                    <IconShopBag
                      onClick={() => cartOpen()}
                      fill="#4C86F9"
                      className="cursor-pointer"
                    />
                    {/* </Button> */}
                  </Badge>

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
                    <PopoverContent className="addsub bg-white ">
                      <div className="flex justify-between items-center">
                        <Button
                          className="bgnone p-0 m-0 text-base font-semibold"
                          radius="full"
                          isIconOnly
                          size="md"
                          onClick={() => handleAddCart("remove")}
                        >
                          -
                        </Button>
                        <p className="bgnonetext-sm font-semibold px-2 ">
                          {data?.data?.qty ? data?.data?.qty : 0}
                        </p>
                        <Button
                          className="bgnone p-0 m-0 text-base font-semibold "
                          radius="full"
                          isIconOnly
                          size="md"
                          onClick={() => handleAddCart("add")}
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
      <ProductDetail isOpen={isOpen} onClose={onClose} item={item} />
      <BuyCard isOpen={cartIsOpen} onClose={cartClose} />
    </>
  );
};
export default PremiumCard;
