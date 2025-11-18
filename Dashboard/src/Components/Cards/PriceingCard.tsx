import React from "react";
import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Image,
} from "@nextui-org/react";
import { Link } from "react-router-dom";
import InputNextUI from "../Common/Input/input";
import { getCookie } from "../../JsFiles/CommonFunction.mjs";
import {
  useAddSubcriptionMutation,
  useGetSubcriptionByCustomerIDQuery,
  useUpdatesubscriptionMutation,
} from "../../views/Subscriptions/Service.mjs";
import { useAppSelector } from "../../Common/hooks";

function PriceingCard({ item = null, subscription = null }) {
  const [formData, setFormData] = React.useState({
    itemCount: item.defaultValue,
  });
  const currentStoreUserId = getCookie("storeId");
  const currentVendorUserId = getCookie("vendorId");

  let currentUserId = currentStoreUserId
    ? currentStoreUserId
    : currentVendorUserId;

  let tempValues = {
    id: currentUserId,
    subscriptionType: subscription.key ? subscription.key : null,
  };
  const { data, error, refetch } =
    useGetSubcriptionByCustomerIDQuery(tempValues, { skip: !tempValues });
  const currentloginDetails = useAppSelector(
    (state) => state.globalConfig.currentloginDetails
  );
  const [addSubCription] = useAddSubcriptionMutation();
  const [updatesubscription] = useUpdatesubscriptionMutation();
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

  const onHandleFormData = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Payment and subscription logic (kept as is for brevity)
  const handleSubmit = async () => {
    try {
      if (!scriptLoaded) {
        console.error("Razorpay script not loaded");
        return;
      }

      const isItemBased = item?.key === "PL1_004" || item?.key === "PL1_005";
      const isFixedPlan = item.key === "PL1_002" || item.key === "PL1_003";

      const basePrice = Number(item?.basePrice || 0);
      const perItemPrice = Number(item?.price || 0);
      const itemCount = Number(formData?.itemCount || 1);

      let amountInRupees;

      if (isItemBased) {
        amountInRupees = (perItemPrice * itemCount) + basePrice;
      } else if (isFixedPlan) {
        amountInRupees = perItemPrice; // Fixed price plans
      } else {
        amountInRupees = perItemPrice * itemCount; // Standard plans with count
      }

      if (amountInRupees <= 0) {
        console.error("Invalid payment amount");
        return;
      }

      const amountInPaisa = Math.round(amountInRupees * 100);

      const options = {
        key: "rzp_live_RgPc8rKEOZbHgf",
        amount: amountInPaisa,
        currency: "INR",
        name: "Nickname Infotech",
        description: "For Subscriptions",
        payment_capture: 1,
        capture: true,
        handler: function (response: any) {
          const paymentId = response.razorpay_payment_id;
          if (paymentId) {
            afterPaymentSuccess(formData, amountInPaisa, paymentId);
          } else {
            afterPaymentSuccess(formData, amountInPaisa, "TEMP_PAYMENT_ID_DEV");
          }
        },
        prefill: {
          name: `${currentloginDetails?.data?.firstName || ""}`,
          email: `${currentloginDetails?.data?.email || ""}`,
          contact: `${currentloginDetails?.data?.phone || ""}`,
        },
        theme: {
          color: "#3399cc",
        },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error initializing Razorpay:", error);
      afterPaymentSuccess(formData, "-1", "TEMP_PAYMENT_ID_DEV");
    }
  };

  const afterPaymentSuccess = async (formData, amountInPaisa, paymentId) => {
    let tempApiValue = {
      subscriptionCount: formData?.[item.key] ? Number(formData?.[item.key]) : item?.key === "PL1_002" ? 100 : formData?.itemCount ? formData?.itemCount : 200,
      subscriptionPrice: amountInPaisa,
      subscriptionType: subscription.key,
      subscriptionPlan: item.key,
      customerId: currentUserId,
      status: 1,
      id: data?.data?.id,
      freeCount: 0,
      paymentId: paymentId,
    };
    let result = await addSubCription(tempApiValue);
    refetch();
  };

  // Helper functions for price calculation and plan styling
  const isItemBased = item?.key === "PL1_004" || item?.key === "PL1_005";
  const isFixedPlan = item.key === "PL1_002" || item.key === "PL1_003" || item.key === "PL3_001";
  const basePrice = Number(item?.basePrice || 0);
  const perItemPrice = Number(item?.price || 0);
  const itemCount = Number(formData?.itemCount || 1);

  const calculateTotalPrice = () => {
    if (isFixedPlan) {
      return perItemPrice;
    } else if (isItemBased) {
      return (perItemPrice * itemCount) + basePrice;
    } else {
      return perItemPrice * itemCount;
    }
  };

  const totalPrice = calculateTotalPrice();

  const getPriceDisplay = () => {
    if (isItemBased) {
      return (
        <p className="text-3xl font-bold">
          &#8377; {basePrice} <span className="text-lg font-normal">+ &#8377;{perItemPrice} Per Item</span>
        </p>
      );
    }
    return (
      <p className="text-3xl font-bold">&#8377; {totalPrice}</p>
    );
  };


  const planMap = {
    Starter: { chipColor: "success", buttonColor: "success", borderClass: "border-green-500" },
    Standard: { chipColor: "primary", buttonColor: "primary", borderClass: "border-blue-500" },
    Premium: { chipColor: "secondary", buttonColor: "secondary", borderClass: "border-purple-600" },
    Enterprise: { chipColor: "default", buttonColor: "default", borderClass: "border-gray-400" },
  };
  const planStyles =
    planMap[item?.name] || { chipColor: "primary", buttonColor: "primary", borderClass: "border-default-300" };

  // --- START: Component Render ---
  return (
    <div>
      <Card
        className={`max-w-[400px] border-2 ${planStyles.borderClass} ${data?.data?.subscriptionPlan === item.key ? "bg-stripe-gradient" : ""
          }`}
      >
        {/* CardHeader: Plan Name, Status, and Billing Info */}
        <CardHeader className="flex flex-col items-start p-4">
          <div className="flex justify-between w-full items-start">
            <div className="flex flex-col">
              {item?.saveLabel && (
                <Chip size="sm" color={planStyles.chipColor} variant="solid" className="mb-2 w-fit">
                  {item.saveLabel}
                </Chip>
              )}
              <p className="text-xl font-bold">{item.name} {(item.key === "PL1_002" ? <span className="text-red-500 text-base">( 1 - 100 Products)</span> : item.key === "PL1_003" ? <span className="text-red-500 text-base">( 1 - 200 Products)</span> : item.key === "PL1_004" || item.key === "PL1_005" ? <span className="text-red-500 text-base"> ( Above 200 Products) </span> : "")}<span className="text-red-500 text-base"></span></p>
              <p className="text-small text-default-500">Billed Annually <span className="text-red-500 text-base">(Yearly)</span></p>
              {data?.data?.subscriptionPlan === item.key && (
                <p className="text-small text-red-500 mt-1">
                  Current Plan Items : {data?.data?.subscriptionCount}
                </p>
              )}
            </div>
            {data?.data?.subscriptionPlan === item.key && (
              <Chip color="warning" variant="dot" className="ml-4">Current Plan</Chip>
            )}
          </div>
        </CardHeader>

        <Divider />

        {/* CardBody: Price, Input, and Features */}
        <CardBody className="p-6">

          {/* 💰 Price Display Section */}
          <div className="mb-4 flex flex-col items-start">
            {getPriceDisplay()}
            {item?.oldPrice && (
              <p className="text-default-400 line-through text-sm mt-1">&#8377; {item.oldPrice}</p>
            )}
            <p className="text-small text-default-500 mt-1">Billed Annually</p>
          </div>
          <Divider className="my-3" />


          {/* 🔢 Quantity Input Section */}
          {!isFixedPlan && (
            <div className="mb-4" style={{ boxShadow: "0px 0px 13px 0px #d5d5d5" }}>
              <InputNextUI
                onChange={(value) => onHandleFormData(item.key, value)}
                label={item?.label || "Enter number of item"}
                size="md"
                type="number"
                min={1}
                defaultValue={item?.defaultValue || 1}
              />
            </div>
          )}
          {/* Original Description (kept for compatibility if used) */}
          {item?.discription && (
            <div className="text-small text-default-600">
              {item.discription}
            </div>
          )}
        </CardBody>

        <Divider />

        {/* CardFooter: Final Price and Action Button */}
        <CardFooter className="justify-between items-center p-4">
          <div className="flex flex-col items-start">
            <p className="text-sm text-default-500">Total Price:</p>
            <p className="text-xl font-bold">&#8377; {totalPrice}</p>
          </div>
          <Button
            color={planStyles.buttonColor}
            onClick={() => handleSubmit()}
            isDisabled={(subscription?.commingSoon) || totalPrice <= 0}
            className="ml-4"
          >
            {item?.contactSales ? "Contact Sales" : "Choose Plan"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PriceingCard;