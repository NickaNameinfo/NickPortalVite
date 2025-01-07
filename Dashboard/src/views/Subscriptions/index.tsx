import React from "react";
import { Accordion, AccordionItem, Chip } from "@nextui-org/react";
import PriceingCard from "../../Components/Cards/PriceingCard";

const Subscriptions = () => {
  const [subscriptionList, setSubscriptionList] = React.useState([
    {
      key: "Plan1",
      name: "Convert to E-Commerce",
      plans: [
        {
          name: "Weekly",
          key: "PL1_001",
          discription:
            "Make beautiful websites regardless of your design experience.",
          label: "Enter number of item",
          price: 19,
          defaultValue: 5,
        },
        {
          name: "Monthly",
          key: "PL1_002",
          discription:
            "Make beautiful websites regardless of your design experience.",
          label: "Enter number of item",
          price: 19,
          defaultValue: 5,
        },
        {
          name: "Yearly",
          key: "PL1_003",
          discription:
            "Make beautiful websites regardless of your design experience.",
          label: "Enter number of item",
          price: 19,
          defaultValue: 5,
        },
      ],
    },
    {
      key: "Plan2",
      name: "Product Customization",
      plans: [
        {
          name: "Weekly",
          key: "PL1_001",
          discription:
            "Make beautiful websites regardless of your design experience.",
          label: "Enter number of item",
          price: 19,
          defaultValue: 5,
        },
        {
          name: "Monthly",
          key: "PL1_002",
          discription:
            "Make beautiful websites regardless of your design experience.",
          label: "Enter number of item",
          price: 19,
          defaultValue: 4,
        },
        {
          name: "Yearly",
          key: "PL1_003",
          discription:
            "Make beautiful websites regardless of your design experience.",
          label: "Enter number of item",
          price: 19,
          defaultValue: 3,
        },
      ],
    },
    {
      key: "Plan3",
      name: "Add's (Advertisements)",
      plans: [
        {
          name: "Weekly",
          key: "PL1_001",
          discription:
            "Make beautiful websites regardless of your design experience.",
          label: "Enter number of item",
          price: 19,
          defaultValue: 5,
        },
        {
          name: "Monthly",
          key: "PL1_002",
          discription:
            "Make beautiful websites regardless of your design experience.",
          label: "Enter number of item",
          price: 19,
          defaultValue: 4,
        },
        {
          name: "Yearly",
          key: "PL1_003",
          discription:
            "Make beautiful websites regardless of your design experience.",
          label: "Enter number of item",
          price: 19,
          defaultValue: 3,
        },
      ],
    },
    {
      key: "four",
      name: "Map View",
      plans: [
        {
          name: "3 Month",
          price: 19,
        },
        {
          name: "6 Month",
          price: 19,
        },
        {
          name: "12 Month",
          price: 19,
        },
      ],
    },
    {
      key: "four",
      name: "Sales Reports",
      plans: [
        {
          name: "3 Month",
          price: 19,
        },
        {
          name: "6 Month",
          price: 19,
        },
        {
          name: "12 Month",
          price: 19,
        },
      ],
    },
    {
      key: "five",
      name: "Customer Support for Product",
      plans: [
        {
          name: "Day's",
          price: 19,
          defaultValue: 1,
        },
        {
          name: "Weekly",
          price: 19,
          defaultValue: 7,
        },
        {
          name: "Monthly",
          price: 19,
          defaultValue: 31,
        },
        {
          name: "Yearly",
          price: 19,
          defaultValue: 365,
        },
      ],
    },
    {
      key: "six",
      name: "Invoice Generation",
      plans: [
        {
          name: "Weekly",
          price: 19,
          defaultValue: 5,
        },
        {
          name: "Monthly",
          price: 19,
          defaultValue: 5,
        },
        {
          name: "Yearly",
          price: 19,
          defaultValue: 5,
        },
      ],
    },
    {
      key: "seven",
      name: "Customer List",
    },
    {
      key: "eight",
      name: "Request List",
    },
    {
      key: "nine",
      name: "Transaction List",
    },
    {
      key: "tem",
      name: "Setup Store Payment Gateway",
    },
    {
      key: "leven",
      name: "Delivery Partner Customizations",
    },
    {
      key: "twelve",
      name: "Feedback and Ratings Details",
    },
  ]);

  return (
    <div className="my-2">
      <Accordion variant="splitted">
        {subscriptionList?.map((subscription, index) => {
          return (
            <AccordionItem
              key={index}
              aria-label={`Accordion ${index}`}
              title={subscription?.name}
              startContent={subscription?.key !== "Plan1" && subscription?.key !== "Plan2" && subscription?.key !== "Plan3" && <Chip color="danger" size="sm">Comming soon</Chip>}
              // isDisabled={ subscription?.key !== "Plan1" && subscription?.key !== "Plan2" && subscription?.key !== "Plan3" ? true : false}
            >
              <div className="grid xm:grid-cols-1 mm:grid-cols-1 ml:grid-cols-1 sm:grid-cols-2  md:grid-cols-2  lg:grid-cols-2  xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-4 gap-2">
                {subscription?.plans?.map((item) => {
                  return (
                    <PriceingCard subscription={subscription} item={item} />
                  );
                })}
              </div>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default Subscriptions;
