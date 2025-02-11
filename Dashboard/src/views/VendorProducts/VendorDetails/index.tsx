import VendorHeaderCard from "../../../Components/Cards/VendorHeaderCard";
import PremiumCard from "../../../Components/Cards/PremiumCard";
import RelatedVendors from "../../../Components/Cards/RelatedVendors";
import { useParams } from "react-router-dom";
import {
  useGetVendorsProductByIdQuery,
  useGetVendorsByIdQuery,
} from "../Service.mjs";
import React from "react";
import { getCookie } from "../../.././JsFiles//CommonFunction.mjs";
import { NoProductsFound } from "../../NoItems/NoProductsFound";
import { useAppSelector } from "../../../Common/hooks";
import { BuyCard } from "../../../Components/Cards/BuyCard";
import { ProductDetail } from "../../../Components/Cards/ProductDetails";

const VendorDetails = () => {
  const { id } = useParams();
  const currentPlan = getCookie("plan");
  const vendorId = getCookie("vendorId");
  const { data, error, refetch } = useGetVendorsProductByIdQuery(Number(id));
  const {
    data: vendorDetails,
    error: vendorError,
    refetch: vendorRefetch,
  } = useGetVendorsByIdQuery(id);

  const isProductDetailsModalOpen = useAppSelector(
    (state) => state.globalConfig.isProductDetailsModalOpen
  );

  const isOpenCartModal = useAppSelector(
    (state) => state.globalConfig.isOpenCartModal
  );

  // Refetch the data when the id changes
  React.useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);

  console.log(isOpenCartModal, "asdf7a0s97")

  return (
    <div>
      <VendorHeaderCard item={vendorDetails?.data?.[0]} />
      {data?.data?.length > 0 ? (
        <div className="grid xm:grid-cols-1 mm:grid-cols-1 ml:grid-cols-1 sm:grid-cols-2  md:grid-cols-3  lg:grid-cols-3  xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-5 gap-2">
          {data?.data?.map((result, index) =>
            Number(result?.product?.isEnableEcommerce) === 1 ? (
              <PremiumCard item={result} key={index} />
            ) : (
              <RelatedVendors item={result} key={index} />
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

export default VendorDetails;
