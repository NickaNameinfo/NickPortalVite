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
import {getCookie} from "../../JsFiles/CommonFunction.mjs"
import {useAddSubcriptionMutation, useGetSubcriptionByCustomerIDQuery, useUpdatesubscriptionMutation} from "../../views/Subscriptions/Service.mjs"
const PriceingCard = ({ item = null, subscription = null }) => {
  const [formData, setFormData] = React.useState({
    itemCount : item.defaultValue
  })
  const currentStoreUserId = getCookie("storeId");
  const currentVendorUserId = getCookie("vendorId");
  let currentUserId = currentStoreUserId ? currentStoreUserId : currentVendorUserId
  let tempValues = {
    id : currentUserId,
    subscriptionType : subscription.key ? subscription.key : null
  }
  const { data, error, refetch } = useGetSubcriptionByCustomerIDQuery(tempValues);
  const [addSubCription] = useAddSubcriptionMutation();
  const [updatesubscription] = useUpdatesubscriptionMutation();

  React.useEffect(() => {
    refetch();
  }, []);

  const onHandleFormData = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    let tempApiValue = {
      subscriptionCount: formData?.itemCount,
      subscriptionPrice: item?.price * formData?.itemCount,
      subscriptionType : subscription.key,
      subscriptionPlan : item.key,
      customerId : currentUserId,
      status : 1,
      id : data?.data?.[0]?.id
    }

    if(data?.success){
      let result = await updatesubscription(tempApiValue)
    }else{
      let result = await addSubCription(tempApiValue)
    }
    refetch();
  }

  console.log(data?.data?.[0], "data?.data?.[0]9078", item)

  return (
    <div>
      <Card className="max-w-[400px]">
        <CardHeader className="flex gap-3">
          <Image
            alt="nextui logo"
            height={40}
            radius="sm"
            src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
            width={40}
          />
          <div className="flex flex-col">
            <p className="text-md">{item.name}</p>
            <p className="text-small text-default-500">
              Items : {item?.defaultValue}
            </p>
          </div>
          {data?.data?.[0]?.subscriptionPlan === item.key && <Chip color="warning" variant="dot">Current Plan</Chip>}
        </CardHeader>
        <Divider />
        <CardBody>
          <p>{item.discription}</p>
        </CardBody>
        <Divider />
        <CardFooter className="justify-between">
          <InputNextUI onChange={(value) =>onHandleFormData("itemCount", value)} label={item?.label} size="md" />
          <Chip
            className="mx-2"
            startContent={<p></p>}
            variant="faded"
            color="success"
            size="lg"
          >
            $ {item?.price * formData?.itemCount}
          </Chip>
          <Button onClick={() => handleSubmit()} isDisabled={subscription?.key !== "Plan1" && subscription?.key !== "Plan2" && subscription?.key !== "Plan3" ? true : false}>Order</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PriceingCard;
