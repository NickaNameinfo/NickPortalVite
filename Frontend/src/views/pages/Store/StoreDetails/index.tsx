import React from "react";
import StoreHeaderCard from "../../../../Components/Card/StoreHeaderCard";
import PremiumCard from "../../../../Components/Card/PremiumCard";
import RelatedProducts from "../../../../Components/Card/RelatedProducts";
import { useParams } from "react-router-dom";
import { useGetStoresProductByIDQuery } from "../Service.mjs";
import { getCookie } from "../../../../JsFiles/CommonFunction.mjs";
import { useAppSelector } from "../../../../Components/Common/hooks";
import { NoProductsFound } from "../../NoItems/NoProductsFound";

const StoreDetails = () => {
  const { id } = useParams();
  const currentPlan = getCookie("plan");
  const { data, error, refetch } = useGetStoresProductByIDQuery(Number(id));
  console.log(data, "datqasedfeqa4432a");

  // Refetch the data when the id changes
  React.useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);
  return (
    <div>
      <StoreHeaderCard />
      {data?.data?.length > 0 ? (
        <div className="grid xm:grid-cols-1 mm:grid-cols-1 ml:grid-cols-1 sm:grid-cols-2  md:grid-cols-3  lg:grid-cols-3  xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-5 gap-2">
          {data?.data?.map((result, index) =>
            result?.plan !== 0 ? (
              <PremiumCard item={result} key={index} />
            ) : (
              <RelatedProducts item={result} key={index} />
            )
          )}
        </div>
      ) : (
        <NoProductsFound />
      )}
    </div>
  );
};

export default StoreDetails;
