import React from "react";
import { Accordion, AccordionItem, Chip } from "@nextui-org/react";
import PriceingCard from "../../Components/Cards/PriceingCard";

const Subscriptions = () => {
  const [subscriptionList, setSubscriptionList] = React.useState([
    // {
    //   key: "Plan0",
    //   name: "Select Product to Sell",
    //   commingSoon: false,
    //   plans: [
    //     {
    //       name: "Monthly",
    //       key: "PL0_001",
    //       discription:
    //         "Make beautiful websites regardless of your design experience.",
    //       label: "Enter number of item",
    //       price: 25,
    //       defaultValue: 1,
    //       freeCount : 5
    //     },
    //     {
    //       name: "Yearly",
    //       key: "PL0_002",
    //       discription:
    //         "Make beautiful websites regardless of your design experience.",
    //       label: "Enter number of item",
    //       price: 289,
    //       defaultValue: 1,
    //     },
    //   ],
    // },
    {
      key: "Plan1",
      name: "Convert to E-Commerce",
      commingSoon: false,
      plans: [
        {
          name: "Starter",
          key: "PL1_001",
          discription: (
            <div>
              <p className="text-md font-semibold mb-2">Key Features:</p>
              <ul className="space-y-2 text-small">
                {/* Based on the image, the features are: */}
                <li className="flex items-center gap-2 text-default-700">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Unlimited Offline Products</span>
                </li>
                <li className="flex items-center gap-2 text-default-700">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>No Commission</span>
                </li>
                <li className="flex items-center gap-2 text-default-700">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Delivery Partner</span>
                </li>
                <li className="flex items-center gap-2 text-default-700">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Order Support</span>
                </li>
                <li className="flex items-center gap-2 text-default-700">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Store Branding</span>
                </li>
                <li className="flex items-center gap-2 text-default-700">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Unlimited Orders</span>
                </li>
              </ul>
            </div>
          ),
          label: "Enter number of item",
          price: 38,
          defaultValue: 1,
        },
        {
          name: "Standard",
          key: "PL1_002",
          discription: (
            <div>
              <p className="text-md font-semibold mb-2">Key Features:</p>
              <ul className="space-y-2 text-small">
                {/* Based on the image, the features are: */}
                <li className="flex items-center gap-2 text-default-700">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Unlimited Offline Products</span>
                </li>
                <li className="flex items-center gap-2 text-default-700">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>No Commission</span>
                </li>
                <li className="flex items-center gap-2 text-default-700">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Delivery Partner</span>
                </li>
                <li className="flex items-center gap-2 text-default-700">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Order Support</span>
                </li>
                <li className="flex items-center gap-2 text-default-700">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Store Branding</span>
                </li>
                <li className="flex items-center gap-2 text-default-700">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Unlimited Orders</span>
                </li>
              </ul>
            </div>
          ),
          price: 2799,
          defaultValue: "1 - 100",
        },
        {
          name: "Premium",
          key: "PL1_003",
          discription: (
            <div>
              <p className="text-md font-semibold mb-2">Key Features:</p>
              <ul className="space-y-2 text-small">
                {/* Based on the image, the features are: */}
                <li className="flex items-center gap-2 text-default-700">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Unlimited Offline Products</span>
                </li>
                <li className="flex items-center gap-2 text-default-700">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>No Commission</span>
                </li>
                <li className="flex items-center gap-2 text-default-700">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Delivery Partner</span>
                </li>
                <li className="flex items-center gap-2 text-default-700">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Order Support</span>
                </li>
                <li className="flex items-center gap-2 text-default-700">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Store Branding</span>
                </li>
                <li className="flex items-center gap-2 text-default-700">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Unlimited Orders</span>
                </li>
              </ul>
            </div>
          ),
          label: "Enter number of item",
          price: 3799,
          defaultValue: "100 - 200",
        },
        {
          name: "Customized",
          key: "PL1_004",
          discription: (
            <div>
              <p className="text-md font-semibold mb-2">Key Features:</p>
              <ul className="space-y-2 text-small">
                {/* Based on the image, the features are: */}
                <li className="flex items-center gap-2 text-default-700">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Unlimited Offline Products</span>
                </li>
                <li className="flex items-center gap-2 text-default-700">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>No Commission</span>
                </li>
                <li className="flex items-center gap-2 text-default-700">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Delivery Partner</span>
                </li>
                <li className="flex items-center gap-2 text-default-700">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Order Support</span>
                </li>
                <li className="flex items-center gap-2 text-default-700">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Store Branding</span>
                </li>
                <li className="flex items-center gap-2 text-default-700">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Unlimited Orders</span>
                </li>
              </ul>
            </div>
          ),
          label: "Enter number of item",
          price: 17,
          basePrice: 3799,
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
          name: "Starter",
          key: "PL2_001",
          discription: (
            <div>
              <p className="text-md font-semibold mb-2">Key Features:</p>
              <ul className="space-y-2 text-small">
                {/* Based on the image, the features are: */}
                <li className="flex items-center gap-2 text-default-700">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Unlimited Offline Products</span>
                </li>
                <li className="flex items-center gap-2 text-default-700">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>No Commission</span>
                </li>
                <li className="flex items-center gap-2 text-default-700">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Delivery Partner</span>
                </li>
                <li className="flex items-center gap-2 text-default-700">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Order Support</span>
                </li>
                <li className="flex items-center gap-2 text-default-700">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Store Branding</span>
                </li>
                <li className="flex items-center gap-2 text-default-700">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Unlimited Orders</span>
                </li>
              </ul>
            </div>
          ),
          label: "Enter number of item",
          price: 9,
          defaultValue: 1,
        }
      ],
    },
    {
      key: "Plan3",
      name: "Add's (Advertisements)",
      commingSoon: true,
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
