import React from "react";
import StoreHeaderCard from "../../../../Components/Card/StoreHeaderCard";
import PremiumCard from "../../../../Components/Card/PremiumCard";
import RelatedProducts from "../../../../Components/Card/RelatedProducts";
import { useParams } from "react-router-dom";
import { useGetStoresProductByIDQuery } from "../Service.mjs";
import { getCookie } from "../../../../JsFiles/CommonFunction.mjs";
import { useAppSelector } from "../../../../Components/Common/hooks";
import { NoProductsFound } from "../../NoItems/NoProductsFound";
import { ProductDetail } from "../../../../Components/DetailsModales/ProductDetail";
import { BuyCard } from "../../../../Components/Card/BuyCard";

const StoreDetails = () => {
  const { id } = useParams();
  const { data, error, refetch } = useGetStoresProductByIDQuery(Number(id), {skip: !id});

  const isProductDetailsModalOpen = useAppSelector(
    (state) => state.globalConfig.isProductDetailsModalOpen
  );

  const isOpenCartModal = useAppSelector(
    (state) => state.globalConfig.isOpenCartModal
  );

  // React.useEffect(() => {
  //   if (id) {
  //     refetch();
  //   }
  // }, [id, refetch]);
  
  return (
    <div>
      <StoreHeaderCard />
      {data?.data?.length > 0 ? (
        <div className="grid xm:grid-cols-1 mm:grid-cols-1 ml:grid-cols-1 sm:grid-cols-2  md:grid-cols-3  lg:grid-cols-3  xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-5 gap-2">
          {data?.data?.map((result, index) =>
            Number(result?.product?.isEnableEcommerce) === 1 ? (
              <PremiumCard item={result} key={index} />
            ) : (
              <RelatedProducts item={result} key={index} />
            )
          )}
        </div>
      ) : (
        <NoProductsFound />
      )}
      {isProductDetailsModalOpen?.isOpen && (
        <ProductDetail
          isOpen={isProductDetailsModalOpen?.isOpen}
          item={isProductDetailsModalOpen?.item}
        />
      )}

      {isOpenCartModal && <BuyCard isOpen={isOpenCartModal} />}
    </div>
  );
};

export default StoreDetails;
