import * as React from "react";
import "../style.scss";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
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
import { useBoolean } from "../../Common/CustomHooks";
import { infoData } from "../../configData";
import {
  useAddCartMutation,
  useGetCartByProductIdQuery,
  useUpdateCartMutation,
  useDeleteCartItemMutation,
} from "../../views/VendorProducts/Service.mjs";
import { getCookie } from "../../JsFiles/CommonFunction.mjs";
import { useAppDispatch, useAppSelector } from "../../Common/hooks";
import {
  onRefreshCart,
  onUpdateCartModal,
  onUpdateProductDetailsModal,
} from "../../Common/globalSlice";
import InputNextUI from "../Common/Input/input";

export const PremiumCard = ({ item = null }) => {
  const onRefresh = useAppSelector((state) => state.globalConfig.onRefreshCart);
  const id = getCookie("id");
  const [addCart] = useAddCartMutation();
  const [updateCart] = useUpdateCartMutation();
  const [deleteCartItem] = useDeleteCartItemMutation();
  const dispatch = useAppDispatch();
  let productId = {
    id: id,
    productId: item?.product?.id,
  };
  const { data, error, refetch } = useGetCartByProductIdQuery(productId, { skip: productId });
  const [qty, setQty] = React.useState(0);

  React.useEffect(() => {
    onRefresh && dispatch(onRefreshCart(false));
    // refetch();
  }, [onRefresh]);

  React.useEffect(() => {
    handleAddCart(qty);
  }, [qty]);

  const handleAddCart = async (value) => {
    let tempCartValue = {
      productId: item?.product?.id,
      name: item?.product?.name,
      orderId: id,
      price: Number(item?.price),
      total: Number(data?.data?.qty) * Number(item?.price),
      qty: !value || value === 0 ? 0 : value,
      photo: item?.product?.photo,
    };
    if (!value || value === 0) {
      onDeleteCartItems(item?.product?.id);
    } else {
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
    }
  };

  const onDeleteCartItems = async (productId?) => {
    let apiInfo = {
      orderId: id,
      productId: productId,
    };
    const result = await deleteCartItem(apiInfo);
    if (result) {
      dispatch(onRefreshCart(true));
    }
  };

  return (
    <>
      <Card className="Storecard pt-3.5 px-3">
        <CardBody className="overflow-visible p-0 relative">
          <span className="bg-slate-700 z-50 absolute text-white text-xs font-medium px-2.5 py-1 rounded-ss-xl rounded-ee-xl dark:bg-gray-700 dark:text-gray-300">
            {item?.product?.discount}%
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
                <small
                  style={{
                    color: "#999",
                    paddingLeft: "10px",
                  }}
                >
                  Coming soon
                </small>{" "}
                Stocks
              </p>
            </div>
            <div className="w-full flex justify-between mt-2">
              <p className="font-normal text-sm  Pricecolor TextMaincolor p-0">
                Per order
              </p>
              <IconTick
                fill={
                  item?.product?.paymentMode?.includes("1")
                    ? "#49A84C"
                    : "#E6E6E6"
                }
              />
            </div>
            <div className="w-full flex justify-between pt-2">
              <p className="font-normal text-sm  Pricecolor TextMaincolor p-0">
                Online payment
              </p>
              <IconTick
                fill={
                  item?.product?.paymentMode?.includes("2")
                    ? "#49A84C"
                    : "#E6E6E6"
                }
              />
            </div>
            <div className="w-full flex justify-between pt-2 pb-2">
              <p className="font-normal text-sm  Pricecolor TextMaincolor p-0">
                Cash on delivery
              </p>
              <IconTick
                fill={
                  item?.product?.paymentMode?.includes("3")
                    ? "#49A84C"
                    : "#E6E6E6"
                }
              />
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
                    onClick={() =>
                      dispatch(
                        onUpdateProductDetailsModal({
                          isOpen: true,
                          item: item,
                        })
                      )
                    }
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
                      onClick={() => dispatch(onUpdateCartModal({
                        isOpen: true,
                        item: item,
                        qty: data?.data?.qty ? data?.data?.qty : 0,
                        type: "Product",
                      }))}
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
                        <InputNextUI onChange={(value) => setQty(value)} />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};
export default PremiumCard;
