import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Divider,
  useDisclosure,
  Tooltip,
  User,
  ModalFooter,
  Button,
  ScrollShadow,
  Radio,
  RadioGroup,
  Input,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/react";
import { IconDelete, IconInfo, ModalCloseIcon } from "../Icons";
import { useBoolean } from "../Common/CustomHooks";
import { useAppDispatch, useAppSelector } from "../Common/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { onRefreshCart, onUpdateCartModal, onUpdateProductDetailsModal } from "../Common/globalSlice";
import {
  useGetCartByOrderIdQuery,
  useUpdateCartMutation,
  useDeleteCartItemMutation,
  useAddOrderMutation,
  useUpdateAddressMutation,
  useGetAddressesByCustIdQuery,
  useAddAddressMutation,
  useAddPyamentMutation,
  useAddOrderlistMutation,
  useUpdateProductMutation
} from "../../views/pages/Store/Service.mjs";
import { getCookie } from "../../JsFiles/CommonFunction.mjs";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
const columns = [
  { name: "Sl.No", uid: "id" },
  { name: "Product", uid: "photo" },
  { name: "Quantity", uid: "actions" },
  { name: "Price", uid: "price" },
];

export const BuyCard = (props: any) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState('1');
  const [deliveryDate, setDeliveryDate] = React.useState('');
  const [isSelectAddress, setIsSelectAddress] = useState(false);
  const onRefresh = useAppSelector((state) => state.globalConfig.onRefreshCart);
  const isOpenCartModal = useAppSelector(
    (state) => state.globalConfig.isOpenCartModal
  );
  const userId = getCookie("id");
  const { id } = useParams();
  const {
    data: cart,
    error: cartError,
    refetch: cartRefetch,
  } = useGetCartByOrderIdQuery(Number(userId));
  const [updateCart] = useUpdateCartMutation();
  const [deleteCartItem] = useDeleteCartItemMutation();
  const [addOrder] = useAddOrderMutation();
  const [addPayment] = useAddPyamentMutation();
  const [addOrderlist] = useAddOrderlistMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deletId, setDeleteId] = React.useState(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [updateAddress] = useUpdateAddressMutation();
  const [addAddress] = useAddAddressMutation();
  const { data: addresses, refetch: refetchAddresses } = useGetAddressesByCustIdQuery(userId, { skip: !userId });
  const [addressDetails, setAddressDetails] = useState({
    fullname: "",
    phone: "",
    orderId: "",
    custId: "",
    district: "",
    city: "",
    states: "",
    area: "",
    shipping: "",
    id: "",
  });

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [scriptLoaded, setScriptLoaded] = React.useState(false);
  // Razorpay script loading logic (kept as is)
  React.useEffect(() => {
    
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      setScriptLoaded(true);
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };

  }, []);

  React.useEffect(() => {
    cartRefetch()
    onRefresh && dispatch(onRefreshCart(false));
  }, [userId, onRefresh, isOpenCartModal]);

  React.useEffect(() => {
    if (userId) {
      setAddressDetails((prevDetails) => ({
        ...prevDetails,
        custId: userId,
      }));
    }
    if (cart?.data && cart.data.length > 0) {
      setAddressDetails((prevDetails) => ({
        ...prevDetails,
        orderId: cart.data[0].orderId,
      }));
    }
  }, [userId, cart]);

  React.useEffect(() => {
    if (addresses?.data?.length > 0) {
      setSelectedAddress(addresses.data[0]);
    }
  }, [addresses]);

  React.useEffect(() => {
    if (selectedAddress) {
      setAddressDetails({
        fullname: selectedAddress.fullname || "",
        phone: selectedAddress.phone || "",
        orderId: selectedAddress.orderId || "",
        custId: selectedAddress.custId || "",
        district: selectedAddress.district || "",
        city: selectedAddress.city || "",
        states: selectedAddress.states || "",
        area: selectedAddress.area || "",
        shipping: selectedAddress.shipping || "",
        id: selectedAddress.id || "",
      });
    }
  }, [selectedAddress]);

  React.useEffect(() => {
    if (userId) {
      refetchAddresses();
    }
  }, [userId]);

  const handleAddCart = async (type, product) => {
    let tempCartValue = {
      productId: product?.productId,
      name: product?.name,
      orderId: userId,
      price: Number(product?.price),
      total: Number(product?.qty) * Number(product?.price),
      qty: product?.qty
        ? type === "add"
          ? Number(product?.qty) + 1
          : Number(product?.qty) - 1
        : 1,
      photo: props?.item?.product?.photo,
    };
    try {
      const result = await updateCart(tempCartValue);
      if (result) {
        cartRefetch();
      }
    } catch (error) {
      console.log(error);
    }
  };


  const razorpayHandleSubmit = async (amountInRupees, apiParams, paymentResult) => {
    try {
      const options = {
        key: "rzp_live_RgPc8rKEOZbHgf",
        amount: paymentResult?.data?.amount,
        currency: paymentResult?.data?.currency,
        order_id: paymentResult?.data?.id,
        name: "Nickname Infotech",
        description: "For Subscriptions",
        handler: function (response: any) {
          const paymentId = response.razorpay_payment_id;
          if (paymentId) {
            afterPaymentSuccess(apiParams, paymentId, paymentResult);
          } else {
            afterPaymentSuccess(apiParams, "TEMP_PAYMENT_ID_DEV", paymentResult);
          }
        },
        theme: {
          color: "#49a84c",
        },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error);
    }
  };

  const afterPaymentSuccess = async (apiParams, paymentId, paymentResult) => {
    const razorpayPaymentUpdate = await addOrderlist({
      orderCreationId: apiParams?.orderId,
      razorpayPaymentId: paymentId,
      razorpayOrderId: paymentResult?.data?.id,
    });
    if (razorpayPaymentUpdate?.data?.success) {
      if (isOpenCartModal.type !== "Service") {
        // 2. Iterate through the cart and create separate orders for each item
        const orderPromises = cart.data.map(async (item) => {
          const itemApiParams = {
            ...apiParams, // Copy base parameters (including payment method)
            grandTotal: Number(item?.qty * item?.price), // Individual item total
            productIds: item?.productId, // Individual item ID
            qty: item?.qty, // Individual item quantity
          };
          updateProduct({
            id: item?.productId,
            unitSize: String(Number(item?.unitSize) - Number(item?.qty)),
          }).unwrap();
          // Create the individual order record
          await addOrder(itemApiParams);

          // Delete the item from the cart upon successful order creation
          await onDeleteCartItems(item?.productId);
        });
        // Wait for all individual orders to be created and cart items deleted
        await Promise.all(orderPromises);
        setIsSelectAddress(false);
        setSelectedAddress(null);
        MySwal.fire({
          title: <p>Your order placed please vist your order page</p>,
        });
      } else {
        const result = await addOrder(apiParams);
        if (result?.data?.success) {
          setIsSelectAddress(false);
          setSelectedAddress(null);
          MySwal.fire({
            title: <p>Your order placed please vist your order page</p>,
          });
        }
      }
    } else {
      setIsSelectAddress(false);
      return { error: razorpayPaymentUpdate?.data?.message || "Failed to add order" };
    }
  }

  const handleAddOrder = async () => {
    dispatch(onUpdateCartModal({
      isOpen: false,
      item: null,
      qty: 0,
      type: null,
    }));
    dispatch(
      onUpdateProductDetailsModal({
        isOpen: false,
        item: null,
      })
    );
    if (!scriptLoaded) {
      console.error("Razorpay script not loaded");
      return;
    }
    if (isOpenCartModal.type !== "Service") {
      // 1. Calculate the Grand Total for the entire cart
      const grandTotal = cart?.data?.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.qty),
        0
      ) || 0;

      // Create a base set of parameters needed for the order records
      const baseApiParams = {
        custId: userId,
        paymentmethod: selectedPaymentMethod,
        orderId: Number(userId),
        grandTotal: grandTotal, // Total amount for payment initiation
        storeId: id,
        cutomerDeliveryDate: deliveryDate,
        deliveryAddress: selectedAddress || addressDetails,
        orderType: "Product",
      };

      // --- PAYMENT FLOW (Method 1, 2, 4) ---
      if (String(selectedPaymentMethod) === "1" || String(selectedPaymentMethod) === "2" || String(selectedPaymentMethod) === "4") {
        try {
          // 2. Initiate Payment ONCE for the Grand Total
          const paymentResult = await addPayment({
            "amount": grandTotal, // Pass the combined Grand Total
            "currency": "INR",
            // NOTE: Use a unique receipt ID instead of userId for security
            "order_id": userId, // This should ideally be a unique Order ID from your server
            "payment_capture": 1
          });

          if (paymentResult?.data?.success) {
            // 3. Open Razorpay ONCE
            // Pass the baseApiParams (which includes all delivery details)
            await razorpayHandleSubmit(grandTotal, baseApiParams, paymentResult?.data);
          } else {
            toast.error(paymentResult?.data?.message || "Failed to create payment order.");
            return;
          }
        } catch (error) {
          console.error("Razorpay initiation error:", error);
          toast.error("Failed to start payment process.");
          return;
        }
      }
      // --- NON-PAYMENT FLOW (Method 3, COD/Pre-Order) ---
      else {
        // If it's a non-online payment method (e.g., COD), execute orders directly
        const orderPromises = cart.data.map(async (item) => {
          const itemApiParams = {
            ...baseApiParams, // Copy base parameters
            grandTotal: Number(item?.qty * item?.price), // Individual item total
            productIds: item?.productId, // Individual item ID
            qty: item?.qty, // Individual item quantity
            paymentmethod: selectedPaymentMethod, // Ensure payment method is set correctly
          };
          await addOrder(itemApiParams);
          await onDeleteCartItems(item?.productId);
        });

        await Promise.all(orderPromises);

        // Final success message and cleanup (outside the map loop)
        setIsSelectAddress(false);
        setSelectedAddress(null);
        MySwal.fire({
          title: <p>Your order placed please vist your order page</p>,
        });
      }
    } else {
      try {
        const apiParams = {
          custId: userId,
          paymentmethod: selectedPaymentMethod,
          orderId: Number(userId),
          grandTotal: isOpenCartModal.item?.product?.total || 0,
          productIds: isOpenCartModal.item?.product?.id || "",
          qty: isOpenCartModal.item?.product?.qty || 0,
          storeId: id,
          cutomerDeliveryDate: deliveryDate,
          deliveryAddress: selectedAddress || addressDetails, // Include selected or entered address details
          orderType: "Service",
        };
        if (String(selectedPaymentMethod) === "1" || String(selectedPaymentMethod) === "2" || String(selectedPaymentMethod) === "4") {
          try {
            const paymentResult = await addPayment({
              "amount": apiParams.grandTotal,
              "currency": "INR",
              "order_id": userId,
              "payment_capture": 1
            });
            if (paymentResult?.data?.success) {
              await razorpayHandleSubmit(apiParams.grandTotal, apiParams, paymentResult?.data);
            } else {
              return { error: paymentResult?.data?.message || "Failed to add payment" };
            }
          } catch (error) {
            console.log(error, "afdsadf");
          }
        } else {
          const result = await addOrder(apiParams);
          if (result?.data?.success) {
            setIsSelectAddress(false);
            setSelectedAddress(null);
            MySwal.fire({
              title: <p>Your order placed please vist your order page</p>,
            });
          } else {
            return { error: result?.data?.message || "Failed to add order" };
          }
        }
      } catch (error) {
        console.error("Failed to add order for item:", error);
        return { error: "Failed to add order" }; // Return null for failed orders
      }
    }
  };

  const onDeleteCartItems = async (productId?) => {
    let apiInfo = {
      orderId: userId,
      productId: productId ? productId : deletId,
    };
    const result = await deleteCartItem(apiInfo);
    if (result) {
      onClose();
      setDeleteId(null);
      dispatch(onRefreshCart(true));
    }
  };

  const handleAddressChange = (e) => {
    setAddressDetails({
      ...addressDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateAddress = async () => {
    try {
      const apiInfo = {
        ...addressDetails,
        custId: userId,
      };
      const result = await updateAddress(apiInfo);
      if (result?.data?.success) {
        toast.success("Address updated successfully!");
        refetchAddresses();
      } else {
        toast.error("Failed to update address.");
      }
    } catch (error) {
      toast.error("Error updating address.");
      console.error("Address update error:", error);
    }
  };
  const handleAddAddress = async () => {
    try {
      const apiInfo = {
        ...addressDetails,
        custId: userId,
      };
      const result = await addAddress(apiInfo);
      if (result?.data?.success) {
        toast.success("Address added successfully!");
        refetchAddresses();
      } else {
        toast.error("Failed to add address.");
      }
    } catch (error) {
      toast.error("Error adding address.");
      console.error("Address add error:", error);
    }
  };

  const renderCell = React.useCallback((data, columnKey) => {
    switch (columnKey) {
      case "photo":
        return (
          <User
            className="p-0 m-0"
            avatarProps={{
              radius: "lg",
              src: `${data.photo}`,
            }}
            name={null}
          ></User>
        );
      case "actions":
        return (
          <div className=" flex items-center">
            <div className="rounded-lg bg-gray-200 flex justify-between items-center mr-1">
              <Button
                className="bg-gray-200 3xl:w-unit-10 3xl:h-unit-8 3xl:min-h-unit-8 2xl:w-unit-10 2xl:h-unit-8 2xl:min-h-unit-8 xl:w-unit-10 xl:h-unit-8 xl:min-h-unit-8 lg:w-unit-10 lg:h-unit-8 lg:min-h-unit-8 xm:min-w-unit-6 ml:min-h-unit-6 xm:min-h-unit-6 mm:min-h-unit-6 xm:w-unit-4 xm:h-unit-4 mm:min-w-unit-6 mm:w-unit-4 mm:h-unit-4 ml:min-w-unit-6 ml:w-unit-4 ml:h-unit-4"
                radius="full"
                isIconOnly
                size="md"
                onClick={() => handleAddCart("remove", data)}
              >
                -
              </Button>
              <p className="bg-gray-200 p-0 m-0 text-sm font-semibold ">
                {data?.qty ? data?.qty : 0}
              </p>

              <Button
                className="bg-gray-200 3xl:w-unit-10 3xl:h-unit-8 3xl:min-h-unit-8 2xl:w-unit-10 2xl:h-unit-8 2xl:min-h-unit-8 xl:w-unit-10 xl:h-unit-8 xl:min-h-unit-8 lg:w-unit-10 lg:h-unit-8 lg:min-h-unit-8 ml:min-h-unit-6 xm:min-h-unit-6 mm:min-h-unit-6 xm:min-w-unit-6 xm:w-unit-4 xm:h-unit-4 mm:min-w-unit-6 mm:w-unit-4 mm:h-unit-4 ml:min-w-unit-6 ml:w-unit-4 ml:h-unit-4"
                radius="full"
                isIconOnly
                size="md"
                onClick={() => handleAddCart("add", data)}
              >
                +
              </Button>
            </div>
            <Button
              className=" bg-gray-200 lg:w-unit-10 lg:h-unit-10 lg:min-h-unit-8 ml:min-h-unit-6 xm:min-h-unit-6 mm:min-h-unit-6 xm:min-w-unit-6 xm:w-unit-4 xm:h-unit-4 mm:min-w-unit-6 mm:w-unit-4 mm:h-unit-4 ml:min-w-unit-6 ml:w-unit-4 ml:h-unit-4"
              isIconOnly
              onPress={onOpen}
              onClick={() => setDeleteId(data.productId)}
              size="md"
            >
              <IconDelete fill="#ff0000" />
            </Button>
          </div>
        );
      default:
        return <p className="m-0 p-0">{data?.[columnKey]}</p>;
    }
  }, []);

  useEffect(() => {
    if (userId) {
      setAddressDetails((prevDetails) => ({
        ...prevDetails,
        custId: userId,
      }));
    }
    if (cart?.data && cart.data.length > 0) {
      setAddressDetails((prevDetails) => ({
        ...prevDetails,
        orderId: cart.data[0].orderId,
      }));
    }
  }, [userId, cart]);

  return (
    <>
      <Modal
        isOpen={isOpenCartModal.isOpen}
        onClose={() => {
          if (isOpenCartModal.isOpen) {
            dispatch(onUpdateCartModal({
              isOpen: false,
              item: null,
              qty: 0,
              type: null,
            }));
          }
        }}
        size={"5xl"}
        shadow="md"
        placement="center"
        backdrop="blur"
        scrollBehavior="inside"
        hideCloseButton
      >
        <ModalContent className="pb-3">
          <>
            <ModalCloseIcon
              onClick={() => {
                dispatch(onUpdateCartModal({
                  isOpen: false,
                  item: null,
                  qty: 0,
                  type: null,
                }));
              }}
              className="modalIconClose"
            />
            <ModalBody className="p-0 m-0 mt-1 pt-2">
              <div className="grid xm:grid-cols-1 mm:grid-cols-1  sm:grid-cols-1 ml:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-2 4xl:grid-cols-2">
                {!isSelectAddress && isOpenCartModal.type === "Product" ? <div className="">
                  {cart?.data?.length > 0 && <Table
                    isHeaderSticky
                    classNames={{
                      base: "xm:max-h-[250px] mm:max-h-[250px] ml:max-h-[250px] md:max-h-[340px] lg:max-h-[340px] xl:max-h-[340px] 2xl:max-h-[340px] 3xl:max-h-[340px] overflow-hidden",
                      table: "w-full",
                    }}
                  >
                    <TableHeader
                      columns={columns}
                      className="sticky top-0 bg-white z-10"
                    >
                      {(column) => (
                        <TableColumn
                          className="ps-0 m-0"
                          key={column.uid}
                          align={column.uid === "actions" ? "center" : "start"}
                        >
                          {column.name}
                        </TableColumn>
                      )}
                    </TableHeader>

                    <TableBody
                      items={cart?.data}
                      className="max-h-[340px] overflow-y-auto p-0 m-0"
                    >
                      {(item: any) => (
                        <TableRow key={item?.["id"]} className="p-0 m-0">
                          {(columnKey) => (
                            <TableCell className="p-1 m-0">
                              {renderCell(item, columnKey)}
                            </TableCell>
                          )}
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>}
                  {cart?.data?.length <= 0 && (
                    <p className="text-center my-3">No Item in Your Cart</p>
                  )}
                  <div className="items-center flex justify-center ">
                    <Button
                      size="sm"
                      color="primary"
                      variant="bordered"
                      className={`ms-3 ${cart?.data?.length <= 0 ? "cursor-not-allowed" : ""
                        }`}
                      onClick={() => navigate(-1)}
                      disabled={cart?.data?.length <= 0}
                    >
                      Buy More Items
                    </Button>
                  </div>
                </div> :
                  <div className="BuycarBg mx-3">
                    {/* Address Update Form */}
                    <div className="p-4 border-t dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Delivery Address</h3>
                      {addresses?.data?.length > 0 && (
                        <div className="space-y-3 mb-4">
                          <RadioGroup
                            value={selectedAddress?.id}
                            onValueChange={(value) => {
                              const address = addresses.data.find((addr) => addr.id === value);
                              setSelectedAddress(address);
                            }}
                          >
                            {addresses.data.map((address) => (
                              <Radio key={address.id} value={address.id}>
                                {`${address.fullname}, ${address.shipping}, ${address.area}, ${address.city}, ${address.district}, ${address.states}, ${address.phone}`}
                              </Radio>
                            ))}
                          </RadioGroup>
                        </div>
                      )}
                      <div className="space-y-3">
                        <input
                          type="text"
                          name="fullname"
                          placeholder="Full Name"
                          value={addressDetails.fullname}
                          onChange={handleAddressChange}
                          className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <input
                          type="text"
                          name="phone"
                          placeholder="Phone"
                          value={addressDetails.phone}
                          onChange={handleAddressChange}
                          className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <input
                          type="text"
                          name="district"
                          placeholder="District"
                          value={addressDetails.district}
                          onChange={handleAddressChange}
                          className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <input
                          type="text"
                          name="city"
                          placeholder="City"
                          value={addressDetails.city}
                          onChange={handleAddressChange}
                          className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <input
                          type="text"
                          name="states"
                          placeholder="State"
                          value={addressDetails.states}
                          onChange={handleAddressChange}
                          className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <input
                          type="text"
                          name="area"
                          placeholder="Area"
                          value={addressDetails.area}
                          onChange={handleAddressChange}
                          className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <input
                          type="text"
                          name="shipping"
                          placeholder="Shipping Address"
                          value={addressDetails.shipping}
                          onChange={handleAddressChange}
                          className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <div className="flex justify-between">
                          <Button
                            onClick={handleAddAddress}
                            className="px-5 rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700"
                          >
                            {"Add Address"}
                          </Button>
                          {selectedAddress && <Button
                            onClick={handleUpdateAddress}
                            variant="ghost"
                            className="px-5 rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700"
                          >
                            {"Update Address"}
                          </Button>}
                        </div>
                      </div>
                    </div>
                  </div>}
                <div>
                  <div className=" BuycarBg mx-3">
                    {isOpenCartModal.type === "Product" ? (
                      <>
                        <div className="flex justify-between py-1 mx-3 font-medium text-sm m-1">
                          <div>
                            Total Products (<b>{cart?.data?.length}</b> Items )
                          </div>
                          <div>
                            {" "}
                            Rs :{" "}
                            {cart?.data
                              ?.reduce(
                                (sum, item) => sum + item.price * item.qty,
                                0
                              ) // Multiply price with qty
                              .toFixed(2) // Ensures two decimal places
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </div>
                        </div>

                        <div className="flex justify-between py-1 mx-3 font-medium text-sm m-1">
                          <div>Delivery Charge</div>
                          <div> Free</div>
                        </div>
                        <Divider orientation="horizontal" className="my-3.5" />
                        <div className="flex justify-between py-1 mx-3 text-base font-medium  m-1">
                          <div>Total Amount</div>
                          <div>
                            {" "}
                            Rs.{" "}
                            {cart?.data
                              ?.reduce(
                                (sum, item) => sum + parseFloat(item.price) * parseFloat(item.qty),
                                0
                              ) // Multiply price with qty
                              .toFixed(2) // Ensures two decimal places
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </div>
                        </div>
                      </>) : <>
                      <p className="text-sm text-default-500 p-3">To move forward with your request, please book your service. This will help us begin the next steps smoothly.</p>
                    </>}
                    <>
                      <Divider orientation="horizontal" className="my-2" />
                      <div className="paymetoptionBg mx-3 mt-2 rounded-lg">
                        <div className="font-medium paymetoption text-base mx-3 pb-2 pt-2">
                          Payment Options
                        </div>
                        <RadioGroup className="w-full" value={selectedPaymentMethod} onChange={(e) => setSelectedPaymentMethod(e.target.value)}>
                          <div className="flex  justify-between items-center mx-3 w-full">
                            <div className="w-2/4 m-1 items-center flex">
                              <Radio
                                value="1"
                                size="sm"
                                className="items-center mr-1"
                                disabled
                              >
                                Online payment
                              </Radio>
                              <Tooltip content={"We accept online payments using credit/debit cards, net banking, and mobile wallets."} showArrow className="w-80"><span><IconInfo fill="#FF0000" width={15} className={"mr-2"} /></span></Tooltip>
                            </div>
                            <div className="w-2/4 m-1 items-center flex">
                              <Radio
                                value="2"
                                size="sm"
                                className="items-center mr-1"
                                disabled
                              >
                                Pre Order
                              </Radio>
                              <Tooltip content={"Pre Order means you can order the product before your going to shop directly and you have to pay the 15% of the total amount to place order."} showArrow className="w-80"><span><IconInfo fill="#FF0000" width={15} className={"mr-2"} /></span></Tooltip>
                            </div>
                          </div>
                          <div className="flex  justify-between items-center mx-3 w-full">
                            <div className="w-2/4 m-1 items-center flex">
                              <Radio
                                value="3"
                                size="sm"
                                className="items-center mr-1"
                                disabled
                              >
                                Cash on Delivery
                              </Radio>
                              <Tooltip content={"Cash on Delivery means you can pay the amount at the time of delivery."} showArrow className="w-80"><span><IconInfo fill="#FF0000" width={15} className={"mr-2"} /></span></Tooltip>
                            </div>
                            <div className="w-2/4 m-1 items-center flex">
                              <Radio
                                value="4"
                                size="sm"
                                className="items-center mr-1"
                                disabled
                              >
                                Delivery in future
                              </Radio>
                              <Tooltip content={"Delivery in future means you can order the product and we will deliver it to you in selected date. and you have to pay the 30% of the total amount to place order."} showArrow className="w-80"><span><IconInfo fill="#FF0000" width={15} className={"mr-2"} /></span></Tooltip>
                            </div>
                          </div>
                          {selectedPaymentMethod === '4' && (
                            <div className="flex  justify-between items-center mx-3 w-full">
                              <div className="w-4/6 m-1 items-center flex">
                                <Input
                                  value={deliveryDate}
                                  onChange={(e) => setDeliveryDate(e.target.value)}
                                  type="date"
                                  className="w-2/4 m-1"
                                />
                              </div>
                            </div>
                          )}
                        </RadioGroup>
                        <div className="flex items-center justify-center mt-4 mb-1">
                          {isOpenCartModal.type === "Product" ?
                            <Button
                              size="sm"
                              color="primary"
                              className={`me-5 ${cart?.data?.length > 0 ? "" : "cursor-not-allowed"
                                }`}
                              disabled={cart?.data?.length > 0 ? false : true}
                              onClick={() => {
                                if (selectedAddress && isSelectAddress) {
                                  handleAddOrder()
                                } else {
                                  setIsSelectAddress(true)
                                }
                              }}
                            >
                              {isSelectAddress ? "Confirm Order" : "Select delivery address"}
                            </Button> :
                            <Button
                              size="sm"
                              color="primary"
                              className={`me-5 ${!selectedAddress ? "cursor-not-allowed" : ""
                                }`}
                              disabled={!selectedAddress}
                              onClick={() => handleAddOrder()}
                            >
                              {"Book Service"}
                            </Button>}
                          <Button
                            size="sm"
                            color="primary"
                            variant="bordered"
                            onClick={() => navigate(-1)}
                          >
                            Back To Shop
                          </Button>
                        </div>
                      </div>
                    </>

                  </div>
                </div>
              </div>
            </ModalBody>
          </>
        </ModalContent>
      </Modal>

      <>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          size="md"
          placement="center"
          backdrop="blur"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Delete Product
                </ModalHeader>
                <ModalBody>
                  Are you sure you want to delete this product ?
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="ghost"
                    color="default"
                    size="sm"
                    onPress={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    onPress={onClose}
                    onClick={() => onDeleteCartItems()}
                  >
                    Delete
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    </>
  );
};
