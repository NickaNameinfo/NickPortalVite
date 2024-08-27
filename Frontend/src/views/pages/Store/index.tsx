import React from "react";
import StoreHeaderCard from "../../../Components/Card/StoreHeaderCard";
import RelatedProducts from "../../../Components/Card/RelatedProducts";
import PremiumCard from "../../../Components/Card/PremiumCard";
import StoreCard from "../../../Components/Card/StoreCard";
import { useGetStoresQuery } from "./Service.mjs";

const Store = () => {
  const { data, error, refetch } = useGetStoresQuery();

  React.useEffect(() => {
    refetch();
  }, []);
  return (
    <>
    <div className="grid mm:grid-cols-2 ml:grid-cols-2 sm:grid-cols-4  md:grid-cols-4  lg:grid-cols-4  xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-4 gap-2 mt-2">
        {data?.data?.map((item, index) => {
          return <StoreCard item={item} key={index} />;
        })}
      </div>
    </>
  );
};

export default Store;
