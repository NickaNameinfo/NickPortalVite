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
import { infoData } from "../../configData";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
const columns = [
  { name: "Sl.No", uid: "id" },
  { name: "Product", uid: "photo" },
  { name: "Quantity", uid: "actions" },
  { name: "Price", uid: "price" },
  { name: "Size", uid: "size" },
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

  const [addressErrors, setAddressErrors] = useState({
    fullname: "",
    phone: "",
    district: "",
    city: "",
    states: "",
    area: "",
    shipping: "",
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
    // Validation: Check stock availability
    const newQty = product?.qty
      ? type === "add"
        ? Number(product?.qty) + 1
        : Number(product?.qty) - 1
      : 1;

    // Get available stock (check if product has size-specific stock)
    let availableStock = Number(product?.unitSize) || 0;
    
    // If product has size, check size-specific stock
    if (product?.size && product?.sizeUnitSizeMap) {
      try {
        const sizeMap = typeof product.sizeUnitSizeMap === 'string' 
          ? JSON.parse(product.sizeUnitSizeMap) 
          : product.sizeUnitSizeMap;
        if (sizeMap[product.size]) {
          availableStock = Number(sizeMap[product.size].unitSize) || 0;
        }
      } catch (e) {
        console.warn('Failed to parse sizeUnitSizeMap for stock check:', e);
      }
    }

    // Validate stock availability when adding quantity
    if (type === "add" && newQty > availableStock) {
      toast.error(`Only ${availableStock} items available in stock!`);
      return;
    }

    // Validate minimum quantity
    if (newQty < 1) {
      toast.error("Quantity cannot be less than 1!");
      return;
    }

    let tempCartValue = {
      productId: product?.productId,
      name: product?.name,
      orderId: userId,
      price: Number(product?.price),
      total: newQty * Number(product?.price),
      qty: newQty,
      photo: props?.item?.product?.photo,
      size: product?.size || "",
      weight: product?.weight || "",
      unitSize: product?.unitSize || "",
    };
    try {
      const result = await updateCart(tempCartValue);
      if (result) {
        cartRefetch();
        if (type === "add") {
          toast.success("Quantity increased!");
        } else {
          toast.success("Quantity decreased!");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update cart!");
    }
  };


  // Helper function to update product unitSize (size-specific or default)
  const updateProductUnitSize = async (productId: number, quantity: number, size?: string) => {
    try {
      const productResponse = await fetch(
        `${infoData.baseApi}/product/getProductById/${productId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!productResponse.ok) {
        console.warn(`Failed to fetch product ${productId}. Status: ${productResponse.status}`);
        return;
      }

      const productResult = await productResponse.json();
      const product = productResult?.data;

      if (!product) {
        console.warn(`Product ${productId} not found`);
        return;
      }

      // Check if product has sizeUnitSizeMap and size is provided
      if (size && size.trim() !== '' && product.sizeUnitSizeMap) {
        try {
          let sizeUnitSizeMap: Record<string, any>;
          if (typeof product.sizeUnitSizeMap === 'string') {
            sizeUnitSizeMap = JSON.parse(product.sizeUnitSizeMap);
          } else {
            sizeUnitSizeMap = product.sizeUnitSizeMap;
          }

          // Find matching size key (case-insensitive)
          let matchingSizeKey: string | null = null;
          for (const key in sizeUnitSizeMap) {
            if (key.toLowerCase() === size.toLowerCase()) {
              matchingSizeKey = key;
              break;
            }
          }

          if (matchingSizeKey) {
            const sizeData = sizeUnitSizeMap[matchingSizeKey];
            let currentSizeUnitSize = 0;

            if (typeof sizeData === 'object' && sizeData !== null) {
              currentSizeUnitSize = Number(sizeData.unitSize) || 0;
            } else if (typeof sizeData === 'string') {
              currentSizeUnitSize = Number(sizeData) || 0;
            }

            if (currentSizeUnitSize > 0) {
              const newSizeUnitSize = currentSizeUnitSize - quantity;

              if (newSizeUnitSize < 0) {
                console.warn(`Size ${size} stock would be negative, skipping update`);
                return;
              }

              // Update the size-specific unitSize in the map
              if (typeof sizeData === 'object' && sizeData !== null) {
                const updatedSizeData = { ...sizeData };
                updatedSizeData.unitSize = newSizeUnitSize.toString();
                sizeUnitSizeMap[matchingSizeKey] = updatedSizeData;
              } else {
                sizeUnitSizeMap[matchingSizeKey] = {
                  unitSize: newSizeUnitSize.toString(),
                  price: '',
                  qty: '',
                  discount: '',
                  discountPer: '',
                  total: '',
                  grandTotal: '',
                };
              }

              // Update the product with modified sizeUnitSizeMap
              await updateProduct({
                id: productId,
                sizeUnitSizeMap: JSON.stringify(sizeUnitSizeMap),
              }).unwrap();

              console.log(`✅ Successfully updated product ${productId} size ${size} unitSize to ${newSizeUnitSize}`);
              return; // Exit early since we updated size-specific stock
            }
          }
        } catch (e) {
          console.warn(`Error parsing sizeUnitSizeMap for product ${productId}:`, e);
          // Fall through to default flow
        }
      }

      // Default flow: Update main product unitSize (if no size or sizeUnitSizeMap doesn't exist)
      const currentUnitSize = Number(product.unitSize) || 0;

      if (currentUnitSize <= 0) {
        return;
      }

      const newUnitSize = currentUnitSize - quantity;

      if (newUnitSize < 0) {
        return;
      }

      await updateProduct({
        id: productId,
        unitSize: newUnitSize.toString(),
      }).unwrap();

      console.log(`✅ Successfully updated product ${productId} unit size to ${newUnitSize}`);
    } catch (e) {
      console.error(`❌ Error updating product unitSize:`, e);
      // Don't throw error as order was successful
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
      if (isOpenCartModal?.type === "Product") {
        // 2. Iterate through the cart and create separate orders for each item
        const orderPromises = cart.data.map(async (item) => {
          const itemApiParams = {
            ...apiParams, // Copy base parameters (including payment method)
            grandTotal: Number(item?.qty * item?.price), // Individual item total
            productIds: item?.productId, // Individual item ID
            qty: item?.qty, // Individual item quantity
            size: item?.size || "",
            weight: item?.weight || "",
          };
          
          // Update product stock (size-specific or default)
          await updateProductUnitSize(item?.productId, Number(item?.qty), item?.size);
          
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
    // Validation: Check if cart is empty
    if (isOpenCartModal.type === "Product" && (!cart?.data || cart.data.length === 0)) {
      toast.error("Your cart is empty!");
      return;
    }

    // Validation: Check address for Product orders
    if (isOpenCartModal.type === "Product") {
      const hasAddress = selectedAddress || (
        addressDetails.fullname &&
        addressDetails.phone &&
        addressDetails.shipping &&
        addressDetails.city &&
        addressDetails.district &&
        addressDetails.states
      );

      if (!hasAddress) {
        toast.error("Please add a delivery address before placing order!");
        setIsSelectAddress(true);
        return;
      }
    }

    // Validation: Check payment method
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method!");
      return;
    }

    // Validation: Check stock availability for all cart items
    if (isOpenCartModal.type === "Product") {
      for (const item of cart.data) {
        let availableStock = Number(item?.unitSize) || 0;
        
        // Check size-specific stock if applicable
        if (item?.size && item?.sizeUnitSizeMap) {
          try {
            const sizeMap = typeof item.sizeUnitSizeMap === 'string' 
              ? JSON.parse(item.sizeUnitSizeMap) 
              : item.sizeUnitSizeMap;
            if (sizeMap[item.size]) {
              availableStock = Number(sizeMap[item.size].unitSize) || 0;
            }
          } catch (e) {
            console.warn('Failed to parse sizeUnitSizeMap for stock check:', e);
          }
        }

        if (Number(item.qty) > availableStock) {
          toast.error(`Insufficient stock for ${item.name}! Only ${availableStock} items available.`);
          return;
        }

        if (availableStock <= 0) {
          toast.error(`${item.name} is out of stock!`);
          return;
        }
      }
    }

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
    if (!scriptLoaded && (String(selectedPaymentMethod) === "1" || String(selectedPaymentMethod) === "2" || String(selectedPaymentMethod) === "4")) {
      console.error("Razorpay script not loaded");
      toast.error("Payment system is not ready. Please try again.");
      return;
    }
    if (isOpenCartModal?.type === "Product") {
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
        size: cart?.data?.size || "",
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
            size: item?.size || "",
            weight: item?.weight || "",
          };
          
          // Update product stock (size-specific or default)
          await updateProductUnitSize(item?.productId, Number(item?.qty), item?.size);
          
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
    } else if (isOpenCartModal?.type === "Service") {
      try {
        const serviceItem: any = isOpenCartModal?.item;
        if (!serviceItem) {
          toast.error("Service item not found!");
          return;
        }
        const apiParams = {
          custId: userId,
          paymentmethod: selectedPaymentMethod,
          orderId: Number(userId),
          grandTotal: serviceItem?.product?.total || serviceItem?.total || 0,
          productIds: serviceItem?.product?.id || serviceItem?.id || "",
          qty: serviceItem?.product?.qty || serviceItem?.qty || 0,
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

  const validateAddressField = (name: string, value: string): string => {
    switch (name) {
      case "fullname":
        if (!value.trim()) {
          return "Full name is required";
        }
        if (value.trim().length < 2) {
          return "Full name must be at least 2 characters";
        }
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          return "Full name should only contain letters and spaces";
        }
        return "";
      case "phone":
        if (!value.trim()) {
          return "Phone number is required";
        }
        if (!/^[0-9]{10}$/.test(value.trim())) {
          return "Phone number must be 10 digits";
        }
        return "";
      case "district":
        if (!value.trim()) {
          return "District is required";
        }
        if (value.trim().length < 2) {
          return "District must be at least 2 characters";
        }
        return "";
      case "city":
        if (!value.trim()) {
          return "City is required";
        }
        if (value.trim().length < 2) {
          return "City must be at least 2 characters";
        }
        return "";
      case "states":
        if (!value.trim()) {
          return "State is required";
        }
        if (value.trim().length < 2) {
          return "State must be at least 2 characters";
        }
        return "";
      case "area":
        if (!value.trim()) {
          return "Area is required";
        }
        if (value.trim().length < 2) {
          return "Area must be at least 2 characters";
        }
        return "";
      case "shipping":
        if (!value.trim()) {
          return "Shipping address is required";
        }
        if (value.trim().length < 5) {
          return "Shipping address must be at least 5 characters";
        }
        return "";
      default:
        return "";
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressDetails({
      ...addressDetails,
      [name]: value,
    });
    // Clear error when user starts typing
    if (addressErrors[name]) {
      setAddressErrors({
        ...addressErrors,
        [name]: "",
      });
    }
  };

  const validateAllAddressFields = (): boolean => {
    const errors = {
      fullname: validateAddressField("fullname", addressDetails.fullname),
      phone: validateAddressField("phone", addressDetails.phone),
      district: validateAddressField("district", addressDetails.district),
      city: validateAddressField("city", addressDetails.city),
      states: validateAddressField("states", addressDetails.states),
      area: validateAddressField("area", addressDetails.area),
      shipping: validateAddressField("shipping", addressDetails.shipping),
    };
    setAddressErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleUpdateAddress = async () => {
    if (!validateAllAddressFields()) {
      toast.error("Please fix the errors in the address form");
      return;
    }

    if (!selectedAddress || !selectedAddress.id) {
      toast.error("Please select an address to update");
      return;
    }

    try {
      const apiInfo = {
        ...addressDetails,
        custId: userId,
        id: selectedAddress.id,
      };
      const result = await updateAddress(apiInfo);
      if (result?.data?.success) {
        toast.success("Address updated successfully!");
        refetchAddresses();
        setAddressErrors({
          fullname: "",
          phone: "",
          district: "",
          city: "",
          states: "",
          area: "",
          shipping: "",
        });
      } else {
        toast.error("Failed to update address.");
      }
    } catch (error) {
      toast.error("Error updating address.");
      console.error("Address update error:", error);
    }
  };
  const handleAddAddress = async () => {
    if (!validateAllAddressFields()) {
      toast.error("Please fix the errors in the address form");
      return;
    }

    try {
      const apiInfo = {
        ...addressDetails,
        custId: userId,
      };
      const result = await addAddress(apiInfo);
      if (result?.data?.success) {
        toast.success("Address added successfully!");
        refetchAddresses();
        // Reset form
        setAddressDetails({
          fullname: "",
          phone: "",
          orderId: addressDetails.orderId,
          custId: userId,
          district: "",
          city: "",
          states: "",
          area: "",
          shipping: "",
          id: "",
        });
        setAddressErrors({
          fullname: "",
          phone: "",
          district: "",
          city: "",
          states: "",
          area: "",
          shipping: "",
        });
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
                        <div>
                          <input
                            type="text"
                            name="fullname"
                            placeholder="Full Name *"
                            value={addressDetails.fullname}
                            onChange={handleAddressChange}
                            onBlur={(e) => {
                              const error = validateAddressField("fullname", e.target.value);
                              setAddressErrors({ ...addressErrors, fullname: error });
                            }}
                            className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white ${
                              addressErrors.fullname
                                ? "border-red-500 dark:border-red-500"
                                : "border-gray-300 dark:border-gray-600"
                            }`}
                          />
                          {addressErrors.fullname && (
                            <p className="text-red-500 text-xs mt-1">{addressErrors.fullname}</p>
                          )}
                        </div>
                        <div>
                          <input
                            type="tel"
                            name="phone"
                            placeholder="Phone *"
                            value={addressDetails.phone}
                            onChange={handleAddressChange}
                            onBlur={(e) => {
                              const error = validateAddressField("phone", e.target.value);
                              setAddressErrors({ ...addressErrors, phone: error });
                            }}
                            maxLength={10}
                            className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white ${
                              addressErrors.phone
                                ? "border-red-500 dark:border-red-500"
                                : "border-gray-300 dark:border-gray-600"
                            }`}
                          />
                          {addressErrors.phone && (
                            <p className="text-red-500 text-xs mt-1">{addressErrors.phone}</p>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            name="district"
                            placeholder="District *"
                            value={addressDetails.district}
                            onChange={handleAddressChange}
                            onBlur={(e) => {
                              const error = validateAddressField("district", e.target.value);
                              setAddressErrors({ ...addressErrors, district: error });
                            }}
                            className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white ${
                              addressErrors.district
                                ? "border-red-500 dark:border-red-500"
                                : "border-gray-300 dark:border-gray-600"
                            }`}
                          />
                          {addressErrors.district && (
                            <p className="text-red-500 text-xs mt-1">{addressErrors.district}</p>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            name="city"
                            placeholder="City *"
                            value={addressDetails.city}
                            onChange={handleAddressChange}
                            onBlur={(e) => {
                              const error = validateAddressField("city", e.target.value);
                              setAddressErrors({ ...addressErrors, city: error });
                            }}
                            className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white ${
                              addressErrors.city
                                ? "border-red-500 dark:border-red-500"
                                : "border-gray-300 dark:border-gray-600"
                            }`}
                          />
                          {addressErrors.city && (
                            <p className="text-red-500 text-xs mt-1">{addressErrors.city}</p>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            name="states"
                            placeholder="State *"
                            value={addressDetails.states}
                            onChange={handleAddressChange}
                            onBlur={(e) => {
                              const error = validateAddressField("states", e.target.value);
                              setAddressErrors({ ...addressErrors, states: error });
                            }}
                            className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white ${
                              addressErrors.states
                                ? "border-red-500 dark:border-red-500"
                                : "border-gray-300 dark:border-gray-600"
                            }`}
                          />
                          {addressErrors.states && (
                            <p className="text-red-500 text-xs mt-1">{addressErrors.states}</p>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            name="area"
                            placeholder="Area *"
                            value={addressDetails.area}
                            onChange={handleAddressChange}
                            onBlur={(e) => {
                              const error = validateAddressField("area", e.target.value);
                              setAddressErrors({ ...addressErrors, area: error });
                            }}
                            className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white ${
                              addressErrors.area
                                ? "border-red-500 dark:border-red-500"
                                : "border-gray-300 dark:border-gray-600"
                            }`}
                          />
                          {addressErrors.area && (
                            <p className="text-red-500 text-xs mt-1">{addressErrors.area}</p>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            name="shipping"
                            placeholder="Shipping Address *"
                            value={addressDetails.shipping}
                            onChange={handleAddressChange}
                            onBlur={(e) => {
                              const error = validateAddressField("shipping", e.target.value);
                              setAddressErrors({ ...addressErrors, shipping: error });
                            }}
                            className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white ${
                              addressErrors.shipping
                                ? "border-red-500 dark:border-red-500"
                                : "border-gray-300 dark:border-gray-600"
                            }`}
                          />
                          {addressErrors.shipping && (
                            <p className="text-red-500 text-xs mt-1">{addressErrors.shipping}</p>
                          )}
                        </div>
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
