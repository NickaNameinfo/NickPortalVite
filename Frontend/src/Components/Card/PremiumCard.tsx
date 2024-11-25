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
  Tooltip,
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
import {
  onRefreshCart,
  onUpdateCartModal,
  onUpdateProductDetailsModal,
} from "../Common/globalSlice";
import { infoData } from "../../configData";
import { getCookie } from "../../JsFiles/CommonFunction.mjs";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const PremiumCard = ({
  item = null,
  isHideImage = false,
  from = null,
  popOverOnClose = null,
}) => {
  const {
    isOpen: cartIsOpen,
    onOpen: cartOpen,
    onClose: cartClose,
  } = useDisclosure();
  const onRefresh = useAppSelector((state) => state.globalConfig.onRefreshCart);
  const userId = getCookie("id");
  const { id } = useParams();
  const [addCart] = useAddCartMutation();
  const [updateCart] = useUpdateCartMutation();
  const dispatch = useAppDispatch();
  let productId = {
    id: userId,
    productId: item?.product?.id,
  };
  const { data, error, refetch } = useGetCartByProductIdQuery(productId);
  const MySwal = withReactContent(Swal);
  React.useEffect(() => {
    onRefresh && dispatch(onRefreshCart(false));
    refetch();
  }, [onRefresh]);

  const handleAddCart = async (type) => {
    let tempCartValue = {
      productId: item?.product?.id ? item?.product?.id : item?.id,
      name: item?.product?.name ? item?.product?.name : item?.name,
      orderId: userId,
      price: Number(item?.price),
      total: Number(data?.data?.qty) * Number(item?.price),
      qty: data?.data?.qty
        ? type === "add"
          ? Number(data?.data?.qty) + 1
          : Number(data?.data?.qty) - 1
        : 1,
      photo: item?.product?.photo ? item?.product?.photo : item?.photo,
      storeId : id
    };
    if (data?.data) {
      try {
        const result = await updateCart(tempCartValue);
        if (result?.data?.success) {
          refetch();
          dispatch(onRefreshCart(true));
        }
      } catch (error) {
        MySwal.fire({
          title: <p>{error?.data?.error}</p>,
        });
      }
    } else {
      try {
        const result = await addCart(tempCartValue);
        if (result?.data?.success) {
          refetch();
          dispatch(onRefreshCart(true));
        } else {
          throw error;
        }
      } catch (error) {
        MySwal.fire({
          title: <p>Please login and continue the shoping</p>,
        });
      }
    }
  };

  return (
    <>
      <Card className="Storecard pt-3.5 px-3">
        {!isHideImage && (
          <CardBody
            className="overflow-visible p-0 relative"
            onClick={() => {
              dispatch(
                onUpdateProductDetailsModal({
                  isOpen: true,
                  item: item,
                })
              );
            }}
          >
            <span className="bg-slate-700 z-50 absolute text-white text-xs font-medium px-2.5 py-1 rounded-ss-xl rounded-ee-xl dark:bg-gray-700 dark:text-gray-300">
              {item?.product?.discount
                ? item?.product?.discount
                : item?.discount}{" "}
              %
            </span>

            <Image
              isZoomed
              alt="Here no Image"
              shadow="md"
              width="100%"
              radius="lg"
              className={`w-full object-cover ${
                from !== "ProductView"
                  ? "min-h-[176px] max-h-[176px]"
                  : "min-h-[50px] max-h-[50px]"
              }`}
              src={`${infoData?.baseApi}/${
                item?.product?.photo ? item?.product?.photo : item?.photo
              }`}
            />
          </CardBody>
        )}

        <CardFooter className="p-0">
          <div className="grid grid-cols-1 w-full">
            <div className="font-semibold text-base mt-2 TextMaincolor">
              <p className="truncate">
                {item?.product?.name ? item?.product?.name : item?.name}
              </p>
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
                Per order
              </p>
              <IconTick
                fill={
                  item?.product?.paymentMode?.includes("1") ? "#49A84C" : "red"
                }
              />
            </div>
            <div className="w-full flex justify-between pt-2">
              <p className="font-normal text-sm  Pricecolor TextMaincolor p-0">
                Online payment
              </p>
              <IconTick
                fill={
                  item?.product?.paymentMode?.includes("2") ? "#49A84C" : "red"
                }
              />
            </div>
            <div className="w-full flex justify-between pt-2 pb-2">
              <p className="font-normal text-sm  Pricecolor TextMaincolor p-0">
                Cash on delivery
              </p>
              <IconTick
                fill={
                  item?.product?.paymentMode?.includes("3") ? "#49A84C" : "red"
                }
              />
            </div>
            <div className="w-full flex justify-around pb-3">
              <div className="PrimiumCardFooterBg rounded-lg flex w-full justify-around items-center">
                <div className="PrimiumCardFooterBg rounded-lg flex w-full justify-around items-center">
                  <Tooltip
                    content="Like"
                    placement="top"
                    className="bg-black text-white"
                    showArrow
                  >
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
                  </Tooltip>
                  <Tooltip
                    content="Product Details"
                    placement="top"
                    className="bg-black text-white"
                    showArrow
                  >
                    <Button
                      className="bgnone p-0 m-0"
                      radius="full"
                      isIconOnly
                      size="lg"
                      onClick={() => {
                        dispatch(
                          onUpdateProductDetailsModal({
                            isOpen: true,
                            item: item,
                          })
                        );
                      }}
                    >
                      <IconsEye fill="#CFA007" className="m-3 cursor-pointer" />
                    </Button>
                  </Tooltip>
                  <Tooltip
                    content="Your Cart"
                    placement="top"
                    className="bg-black text-white"
                    showArrow
                  >
                    <Badge
                      content={data?.data?.qty ? data?.data?.qty : 0}
                      shape="circle"
                      color="danger"
                      onClick={() => {
                        dispatch(onUpdateCartModal(true));
                      }}
                    >
                      {/* <Button
                      className="bgnone p-0 m-0"
                      radius="full"
                      isIconOnly
                      size="lg"
                      onClick={() => cartOpen()}
                    > */}
                      <IconShopBag
                        fill="#4C86F9"
                        className="cursor-pointer"
                        onClick={() => {
                          dispatch(onUpdateCartModal(true));
                        }}
                      />
                      {/* </Button> */}
                    </Badge>
                  </Tooltip>

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
      <BuyCard isOpen={cartIsOpen} onClose={cartClose} />
    </>
  );
};
export default PremiumCard;
