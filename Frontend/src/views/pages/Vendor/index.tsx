import React from "react";
import VendorCard from "../../../Components/Card/vendorCard";
import { useGetVendorsQuery } from "./Service.mjs";
const Vendore = () => {
  const { data, error, refetch } = useGetVendorsQuery();
  console.log(data?.data, "sadfasdf");

  React.useEffect(() => {
    refetch();
  }, []);

  return (
    <div>
      {data?.data?.length > 0 ? (
        <div className="grid mm:grid-cols-2 ml:grid-cols-2 sm:grid-cols-4  md:grid-cols-4  lg:grid-cols-5  xl:grid-cols-5 2xl:grid-cols-7 3xl:grid-cols-8 gap-2 mt-2">
          {data?.data?.map((item, index) => {
            return item?.status === 1 && <VendorCard item={item} key={index} />;
          })}
        </div>
      ) : (
        <div className="cover h-[68vh] text-gray-400">
          <h1>
            Currently, No Vendors Available
            <br />
            Join Us Today!
          </h1>
          <br />
          <h3 className="text-primary">
            Stay Tuned{" "}
            <a href="https://nicknameinfotech.com/" target="_blank">
              Nickname infotech
            </a>
          </h3>
        </div>
      )}
    </div>
  );
};

export default Vendore;
