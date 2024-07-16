import React from "react";
import CompanyCard from "../../../Components/Card/companycard";
import { useGetVendorsQuery } from "./Service.mjs";
const Vendore = () => {
  const { data, error, refetch } = useGetVendorsQuery();
  console.log(data?.data, "sadfasdf");

  React.useEffect(() => {
    refetch();
  }, []);

  return (
    <div>
      <div className="grid mm:grid-cols-2 ml:grid-cols-2 sm:grid-cols-4  md:grid-cols-4  lg:grid-cols-5  xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 gap-2 mt-2">
        {data?.data?.map((item, index) => {
          return <CompanyCard item={item} key={index} />;
        })}
      </div>
    </div>
  );
};

export default Vendore;
