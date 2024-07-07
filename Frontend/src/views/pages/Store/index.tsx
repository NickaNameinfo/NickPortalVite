import React from "react";
import StoreHeaderCard from "../../../Components/Card/StoreHeaderCard";
import GroceryCard from "../../../Components/Card/grocery";
import PremiumCard from "../../../Components/Card/PremiumCard";

const Store = () => {
  return (
    <>
      <StoreHeaderCard />
      <GroceryCard />
      <PremiumCard />
    </>
  );
};

export default Store;
