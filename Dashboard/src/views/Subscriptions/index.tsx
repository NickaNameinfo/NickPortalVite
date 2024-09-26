import React from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import PriceingCard from "../../Components/Cards/PriceingCard";

const Subscriptions = () => {
  const [subscriptionList, setSubscriptionList] = React.useState([
    {
      key: "one",
      name: "Convert to E-Commerce",
    },
    {
      key: "two",
      name: "Product Customization",
    },
    {
      key: "three",
      name: "Add's (Advertisements)",
    },
    {
      key: "four",
      name: "Map View",
    },
    {
      key: "four",
      name: "Sales Reports",
    },
    {
      key: "five",
      name: "Customer Support",
    },
    {
      key: "six",
      name: "Invoice Generation",
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
            <AccordionItem key={index} aria-label={`Accordion ${index}`} title={subscription?.name}>
              <div className="grid xm:grid-cols-1 mm:grid-cols-1 ml:grid-cols-1 sm:grid-cols-2  md:grid-cols-2  lg:grid-cols-2  xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-4 gap-2">
                <PriceingCard />
                <PriceingCard />
                <PriceingCard />
              </div>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default Subscriptions;
