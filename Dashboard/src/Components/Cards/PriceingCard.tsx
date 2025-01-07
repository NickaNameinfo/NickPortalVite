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
const PriceingCard = ({ item = null, subscription = null }) => {
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
    useGetSubcriptionByCustomerIDQuery(tempValues);
    const currentloginDetails = useAppSelector(
      (state) => state.globalConfig.currentloginDetails
    );
  const [addSubCription] = useAddSubcriptionMutation();
  const [updatesubscription] = useUpdatesubscriptionMutation();
  const [scriptLoaded, setScriptLoaded] = React.useState(false);

  React.useEffect(() => {
    refetch();
  }, []);

  console.log(currentloginDetails?.data?.firstName, "currentloginDetails70987")

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

  const handleSubmit = async () => {
    if (scriptLoaded) {
      const options = {
        key: "rzp_live_O2BGPD9Tq493Ln",
        amount: item?.price * formData?.itemCount, // amount in paisa
        currency: "INR",
        name: "Nickname infotech",
        description: "For Subscriptions",
        // image: "../src/assets/img/logo/logo_1.png",
        handler: function (response: any) {
          const paymentId = response.razorpay_payment_id;
          if (paymentId) {
            afterPaymentSuccess(formData);
          }
        },
        prefill: {
          name: `${currentloginDetails?.data?.firstName}`,
          email: currentloginDetails?.data?.email,
          contact: currentloginDetails?.data?.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      console.error("Razorpay script not loaded");
    }
  };

  const afterPaymentSuccess = async (formData) => {
    let tempApiValue = {
      subscriptionCount: formData?.itemCount,
      subscriptionPrice: item?.price * formData?.itemCount,
      subscriptionType: subscription.key,
      subscriptionPlan: item.key,
      customerId: currentUserId,
      status: 1,
      id: data?.data?.[0]?.id,
    };

    if (data?.success) {
      let result = await updatesubscription(tempApiValue);
    } else {
      let result = await addSubCription(tempApiValue);
    }
    refetch();
  };

  return (
    <div>
      <Card
        className={`max-w-[400px] ${
          data?.data?.[0]?.subscriptionPlan === item.key
            ? "bg-stripe-gradient"
            : ""
        }`}
      >
        <CardHeader className="flex gap-3">
          <div className="flex justify-between w-[100%]">
            <div className="flex flex-col">
              <p className="text-md">{item.name}</p>
              <p className="text-small text-default-500">
                Default Items : {item?.defaultValue}
              </p>
              {data?.data?.[0]?.subscriptionPlan === item.key && (
                <p className="text-small text-default-500">
                  Current Plan Items : {data?.data?.[0]?.subscriptionCount}
                </p>
              )}
            </div>
            {data?.data?.[0]?.subscriptionPlan === item.key && (
              <Chip color="warning" variant="dot">
                Current Plan
              </Chip>
            )}
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <p>{item.discription}</p>
        </CardBody>
        <Divider />
        <CardFooter className="justify-between">
          <InputNextUI
            onChange={(value) => onHandleFormData("itemCount", value)}
            label={item?.label}
            size="md"
          />
          <Chip
            className="mx-2"
            startContent={<p></p>}
            variant="faded"
            color="success"
            size="lg"
          >
            &#8377; {item?.price * formData?.itemCount}
          </Chip>
          <Button
            onClick={() => handleSubmit()}
            isDisabled={
              subscription?.key !== "Plan1" &&
              subscription?.key !== "Plan2" &&
              subscription?.key !== "Plan3"
                ? true
                : false
            }
          >
            Order
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PriceingCard;
