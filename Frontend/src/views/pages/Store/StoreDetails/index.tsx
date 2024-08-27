import React from "react";
import StoreHeaderCard from "../../../../Components/Card/StoreHeaderCard";
import PremiumCard from "../../../../Components/Card/PremiumCard";
import RelatedProducts from "../../../../Components/Card/RelatedProducts";
import { useParams } from "react-router-dom";
import { useGetStoresProductByIDQuery } from "../Service.mjs";
import { getCookie } from "../../../../JsFiles/CommonFunction.mjs";

const StoreDetails = () => {
  const { id } = useParams();
  const currentPlan = getCookie("plan");
  const { data, error, refetch } = useGetStoresProductByIDQuery(Number(id));

  console.log(currentPlan, "data3462354", id);
  // Refetch the data when the id changes
  React.useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);
  return (
    <div>
      <StoreHeaderCard/>
      <div className="grid xm:grid-cols-1 mm:grid-cols-1 ml:grid-cols-1 sm:grid-cols-2  md:grid-cols-3  lg:grid-cols-3  xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-5 gap-2">
        {data?.data?.map((result, index) =>
          currentPlan !== "0" ? (
            <PremiumCard item={result} key={index} />
          ) : (
            <RelatedProducts item={result} key={index} />
          )
        )}
      </div>
    </div>
  );
};

export default StoreDetails;
