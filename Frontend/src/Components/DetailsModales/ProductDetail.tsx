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
  Tabs,
  Tab,
  Textarea,
} from "@nextui-org/react";
import React from "react";
import {
  IconHeart,
  IconLocation,
  IconMapRound,
  IconNext,
  IconPrev,
  IconShare,
  IconTick,
  ModalCloseIcon,
} from "../Icons";
import { infoData } from "../../configData";
import { useAppDispatch, useAppSelector } from "../Common/hooks";
import { Link, useParams } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import { RowsPhotoAlbum } from "react-photo-album";
import {
  useGetCartByProductIdQuery,
  useAddCartMutation,
  useUpdateCartMutation,
  useGetStoresByIdQuery,
  useGetStoresQuery,
  useAddOrderMutation,
} from "../../views/pages/Store/Service.mjs";
import {
  onRefreshCart,
  onUpdateCartModal,
  onUpdateProductDetailsModal,
} from "../Common/globalSlice";
import StoreCard from "../Card/StoreCard";
import { toast } from "react-toastify";
import { getCookie } from "../../JsFiles/CommonFunction.mjs";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import StarRating from "../Input/Ratings";

interface ProductDetailProps {
  isOpen: any;
  item: any;
}

export const ProductDetail = (props: ProductDetailProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [customization, setCustomization] = React.useState(null);
  const onRefresh = useAppSelector((state) => state.globalConfig.onRefreshCart);
  const notify = (value) => toast(value);
  const MySwal = withReactContent(Swal);
  const userId = getCookie("id");
  const {
    data: stores,
    error: storesError,
    refetch: storesRefetch,
  } = useGetStoresQuery();
  const {
    data: storeDetails,
    error,
    refetch,
  } = useGetStoresByIdQuery(Number(props?.item?.supplierId));
  let productId = {
    id: userId,
    productId: props?.item?.product?.id
      ? props?.item?.product?.id
      : props?.item?.id,
  };

  const {
    data: cart,
    error: cartError,
    refetch: cartRefetch,
  } = useGetCartByProductIdQuery(productId);

  const [addCart] = useAddCartMutation();
  const [addOrder] = useAddOrderMutation();
  const [updateCart] = useUpdateCartMutation();
  const dispatch = useAppDispatch();
  const [index, setIndex] = React.useState(-1);

  React.useEffect(() => {
    onRefresh && dispatch(onRefreshCart(false));
    refetch();
    storesRefetch();
  }, [onRefresh]);

  const handleAddCart = async (type) => {
    let tempCartValue = {
      productId: props?.item?.product?.id
        ? props?.item?.product?.id
        : props?.item?.id,
      name: props?.item?.product?.name
        ? props?.item?.product?.name
        : props?.item?.name,
      orderId: userId,
      price: Number(props?.item?.price),
      total: Number(cart?.data?.qty) * Number(props?.item?.price),
      qty: cart?.data?.qty
        ? type === "add"
          ? Number(cart?.data?.qty) + 1
          : Number(cart?.data?.qty) - 1
        : 1,
      photo: props?.item?.product?.photo
        ? props?.item?.product?.photo
        : props?.item?.photo,
    };
    if (cart?.data) {
      try {
        const result = await updateCart(tempCartValue);
        if (result?.data?.success) {
          cartRefetch();
        }
      } catch (error) {
        MySwal.fire({
          title: <p>Please login and continue the shoping</p>,
        });
      }
    } else {
      try {
        const result = await addCart(tempCartValue);
        if (result?.data?.success) {
          cartRefetch();
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

  const slides = [
    {
      src: "https://nicknameinfotech.com/img/new-logo.png",
      width: 3840,
      height: 3840,
    },
    {
      src: "https://yet-another-react-lightbox.com/images/image02.jpeg",
      width: 3840,
      height: 3840,
    },
    {
      src: "https://yet-another-react-lightbox.com/images/image03.jpeg",
      width: 3840,
      height: 3840,
    },
  ];

  const handleAddOrder = async () => {
    if (cart?.data?.qty && cart?.data?.qty !== 0) {
      console.log(cart?.data?.qty, "asdf7as9d078");
      try {
        const tempCartValue = {
          customerId: userId,
          paymentmethod: 1,
          orderId: Number(userId),
          grandTotal:
            Number(cart?.data?.qty) * Number(props?.item?.product?.total),
          productIds: props?.item?.product?.id
            ? props?.item?.product?.id
            : props?.item?.id,
          qty: cart?.data?.qty,
          storeId: Number(props?.item?.supplierId),
          customization: customization,
        };
        let response = await addOrder(tempCartValue);
        if (response?.data?.success) {
          MySwal.fire({
            title: <p>Your order placed please vist your order page</p>,
          });
        }
      } catch (error) {
        console.error("Failed to add order for item:", error);
      }
    } else {
      MySwal.fire({
        title: <p>Please select quantity</p>,
      });
    }
  };
  return (
    <>
      <Modal
        size={"5xl"}
        isOpen={props?.isOpen}
        onClose={() => {
          if (props?.isOpen && cart?.data?.qty && cart?.data?.qty !== 0) {
            dispatch(
              onUpdateProductDetailsModal({
                isOpen: false,
                item: null,
              })
            );
          }
        }}
        placement="center"
        scrollBehavior="inside"
        backdrop="blur"
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalCloseIcon
                onClick={() => {
                  dispatch(
                    onUpdateProductDetailsModal({
                      isOpen: false,
                      item: null,
                    })
                  );
                }}
                className="modalIconClose"
              />
              <ModalBody className="p-5">
                <div className="grid xm:grid-cols-2 mm:grid-cols-2  sm:grid-cols-2 ml:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-3 gap-4">
                  <div className="">
                    <Card className="p-4 bg-default/40 mm:w-full ml:w-full">
                      <CardBody className="overflow-visible p-0 relative">
                        <Image
                          alt="Card background"
                          src={`${infoData.baseApi}/${
                            props?.item?.product?.photo
                              ? props?.item?.product?.photo
                              : props?.item?.photo
                          }`}
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
                        {props?.item?.product?.name
                          ? props?.item?.product?.name
                          : props?.item?.name}
                      </h2>
                      <p className="text-slate-300 text-lg line-through font-normal">
                        Rs : {props?.item?.product?.price}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-black text-lg font-normal">
                          Rs: {props?.item?.product?.total}{" "}
                          <span style={{ color: "black", fontSize: "10px" }}>
                            ({props?.item?.product?.unitSize})
                          </span>
                        </p>
                        <div className="text-sm">
                          <small
                            style={{
                              color: "#999",
                              paddingLeft: "10px",
                            }}
                          >
                            Coming soon
                          </small>{" "}
                          Stocks
                        </div>
                      </div>
                      {(Number(props?.item?.product?.isEnableEcommerce) === 1 ||
                        Number(props?.item?.isEnableEcommerce) === 1) && (
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
                              onClick={() => dispatch(onUpdateCartModal(true))}
                            >
                              View Cart
                            </Button>
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-12 justify-between items-center mt-4">
                        <div className="col-span-8">
                          <div className="flex items-center justify-between pb-2.5">
                            <p className="text-sm font-normal">Per Order</p>
                            <IconTick
                              fill={
                                props?.item?.product?.paymentMode?.includes(
                                  "1"
                                ) || props?.item?.paymentMode?.includes("1")
                                  ? "#49A84C"
                                  : "red"
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between pb-2.5">
                            <p className="text-sm font-normal">
                              Online Payment
                            </p>
                            <IconTick
                              fill={
                                props?.item?.product?.paymentMode?.includes(
                                  "2"
                                ) || props?.item?.paymentMode?.includes("2")
                                  ? "#49A84C"
                                  : "red"
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-normal">
                              Cash On Delivery
                            </p>
                            <IconTick
                              fill={
                                props?.item?.product?.paymentMode?.includes(
                                  "2"
                                ) || props?.item?.paymentMode?.includes("2")
                                  ? "#49A84C"
                                  : "red"
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
                        src="https://nicknameinfotech.com/img/new-logo.png"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2">
                  <div className="">
                    <div className="description me-2">
                      <div className="flex w-full flex-col">
                        <Tabs
                          aria-label="Options"
                          color="default"
                          variant="solid"
                          // className="flex-col"
                        >
                          <Tab
                            key="photos"
                            title={
                              <div className="flex items-center space-x-2 ">
                                {/* <GalleryIcon /> */}
                                <span>Description</span>
                              </div>
                            }
                          >
                            <Card className="min-h-[170px]">
                              <CardBody>
                                {props?.item?.product?.sortDesc
                                  ? props?.item?.product?.sortDesc
                                  : props?.item?.sortDesc}
                              </CardBody>
                            </Card>
                          </Tab>
                          {/* <Tab
                            key="music"
                            title={
                              <div className="flex items-center space-x-2">
                                <span>Product Images</span>
                              </div>
                            }
                          >
                            <Card className="min-h-[170px]">
                              <CardBody>
                                {" "}
                                <RowsPhotoAlbum
                                  photos={slides}
                                  targetRowHeight={150}
                                  onClick={({ index: current }) =>
                                    setIndex(current)
                                  }
                                />
                              </CardBody>
                            </Card>
                          </Tab> */}
                        </Tabs>
                      </div>
                    </div>
                  </div>
                  <div className="min-h-[170px]">
                    <h2 className="font-bold my-2">
                      {props?.item?.product?.isEnableCustomize === 1 ||
                      props?.item?.isEnableCustomize === 1
                        ? "Customize Product and order items *"
                        : "Write your feedback"}
                    </h2>
                    <Textarea
                      classNames={{
                        base: "max-w-[100%]",
                        input: "resize-y min-h-[120px]",
                      }}
                      placeholder="Enter your details"
                      onChange={(e) => setCustomization(e.target.value)}
                      errorMessage={
                        !customization
                          ? "Please enter your customization details"
                          : null
                      }
                    />
                    <div className="flex justify-end mt-2">
                      {/* <StarRating maxRating={5} /> */}
                      <Button
                        variant="ghost"
                        color={!customization ? "default" : "success"}
                        disabled={!customization}
                        className={!customization ? "cursor-not-allowed" : ""}
                        onClick={() => {
                          if (
                            props?.item?.product?.isEnableCustomize === 1 ||
                            props?.item?.isEnableCustomize === 1
                          ) {
                            handleAddOrder();
                          }
                        }}
                      >
                        {props?.item?.product?.isEnableCustomize === 1 ||
                        props?.item?.isEnableCustomize === 1
                          ? "Place Order"
                          : "Submit FeedBack"}
                      </Button>
                    </div>
                  </div>
                </div>
              </ModalBody>

              <Lightbox
                index={index}
                slides={slides}
                open={index >= 0}
                close={() => setIndex(-1)}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
