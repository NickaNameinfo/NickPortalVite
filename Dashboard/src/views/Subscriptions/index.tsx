import React from "react";
import { Accordion, AccordionItem, Chip } from "@nextui-org/react";
import PriceingCard from "../../Components/Cards/PriceingCard";

const Subscriptions = () => {
  const [subscriptionList, setSubscriptionList] = React.useState([
    {
      key: "Plan0",
      name: "Select Product to Sell",
      commingSoon: false,
      plans: [
        {
          name: "Monthly",
          key: "PL0_001",
          discription:
            "Make beautiful websites regardless of your design experience.",
          label: "Enter number of item",
          price: 25,
          defaultValue: 1,
          freeCount : 5
        },
        {
          name: "Yearly",
          key: "PL0_002",
          discription:
            "Make beautiful websites regardless of your design experience.",
          label: "Enter number of item",
          price: 289,
          defaultValue: 1,
        },
      ],
    },
    {
      key: "Plan1",
      name: "Convert to E-Commerce",
      commingSoon: false,
      plans: [
        {
          name: "Weekly",
          key: "PL1_001",
          discription:
            "Make beautiful websites regardless of your design experience.",
          label: "Enter number of item",
          price: 80,
          defaultValue: 1,
        },
        {
          name: "Monthly",
          key: "PL1_002",
          discription:
            "Make beautiful websites regardless of your design experience.",
          label: "Enter number of item",
          price: 280,
          defaultValue: 1,
        },
        {
          name: "Yearly",
          key: "PL1_003",
          discription:
            "Make beautiful websites regardless of your design experience.",
          label: "Enter number of item",
          price: 2800,
          defaultValue: 1,
        },
      ],
    },
    {
      key: "Plan2",
      name: "Product Customization",
      commingSoon: false,
      plans: [
        {
          name: "Weekly",
          key: "PL1_001",
          discription:
            "Make beautiful websites regardless of your design experience.",
          label: "Enter number of item",
          price: 27,
          defaultValue: 1,
        },
        {
          name: "Monthly",
          key: "PL1_002",
          discription:
            "Make beautiful websites regardless of your design experience.",
          label: "Enter number of item",
          price: 110,
          defaultValue: 1,
        },
        {
          name: "Yearly",
          key: "PL1_003",
          discription:
            "Make beautiful websites regardless of your design experience.",
          label: "Enter number of item",
          price: 1370,
          defaultValue: 1,
        },
      ],
    },
    {
      key: "Plan3",
      name: "Add's (Advertisements)",
      commingSoon: false,
      plans: [
        {
          name: "Weekly",
          key: "PL1_001",
          discription:
            "Make beautiful websites regardless of your design experience.",
          label: "Enter number of item",
          price: 40,
          defaultValue: 1,
        },
        {
          name: "Monthly",
          key: "PL1_002",
          discription:
            "Make beautiful websites regardless of your design experience.",
          label: "Enter number of item",
          price: 140,
          defaultValue: 1,
        },
        {
          name: "Yearly",
          key: "PL1_003",
          discription:
            "Make beautiful websites regardless of your design experience.",
          label: "Enter number of item",
          price: 1780,
          defaultValue: 1,
        },
      ],
    },
    {
      key: "four",
      name: "Map View",
      commingSoon: true,
      plans: [
        {
          name: "3 Month",
          price: 0,
        },
        {
          name: "6 Month",
          price: 0,
        },
        {
          name: "12 Month",
          price: 0,
        },
      ],
    },
    {
      key: "four",
      name: "Sales Reports",
      commingSoon: true,
      plans: [
        {
          name: "3 Month",
          price: 0,
        },
        {
          name: "6 Month",
          price: 0,
        },
        {
          name: "12 Month",
          price: 0,
        },
      ],
    },
    {
      key: "five",
      name: "Customer Support for Product",
      commingSoon: true,
      plans: [
        {
          name: "Day's",
          price: 0,
          defaultValue: 1,
        },
        {
          name: "Weekly",
          price: 0,
          defaultValue: 1,
        },
        {
          name: "Monthly",
          price: 0,
          defaultValue: 1,
        },
        {
          name: "Yearly",
          price: 0,
          defaultValue: 1,
        },
      ],
    },
    {
      key: "six",
      name: "Invoice Generation",
      commingSoon: true,
      plans: [
        {
          name: "Weekly",
          price: 0,
          defaultValue: 1,
        },
        {
          name: "Monthly",
          price: 0,
          defaultValue: 1,
        },
        {
          name: "Yearly",
          price: 0,
          defaultValue: 1,
        },
      ],
    },
    {
      key: "seven",
      name: "Customer List",
      commingSoon: true,
    },
    {
      key: "eight",
      name: "Request List",
      commingSoon: true,
    },
    {
      key: "nine",
      name: "Transaction List",
      commingSoon: true,
    },
    {
      key: "tem",
      name: "Setup Store Payment Gateway",
      commingSoon: true,
    },
    {
      key: "leven",
      name: "Delivery Partner Customizations",
      commingSoon: true,
    },
    {
      key: "twelve",
      name: "Feedback and Ratings Details",
      commingSoon: true,
    },
  ]);

  return (
    <div className="my-2">
      <Accordion variant="splitted" defaultExpandedKeys={["0"]}>
        {subscriptionList?.map((subscription, index) => {
          return (
            <AccordionItem
              key={index}
              aria-label={`Accordion ${index}`}
              title={subscription?.name}
              startContent={subscription?.commingSoon && <Chip color="danger" size="sm">Comming soon</Chip>}
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
