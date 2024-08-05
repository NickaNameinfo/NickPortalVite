import React from "react";
import VendorCard from "../../Components/Cards/VendorCard";
import { useGetVendorsQuery } from "./Service.mjs";

const VendroProducts = () => {
  const { data, error, refetch } = useGetVendorsQuery();
  console.log(data?.data, "sadfasdf");

  React.useEffect(() => {
    refetch();
  }, []);
  return (
    <div>
      <div className="grid xm:grid-cols-1 mm:grid-cols-1 ml:grid-cols-1 sm:grid-cols-2  md:grid-cols-2  lg:grid-cols-2  xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-4 gap-2">
        {data?.data?.map((item, index) => {
          return <VendorCard item={item} key={index} />;
        })}
      </div>
    </div>
  );
};

export default VendroProducts;
