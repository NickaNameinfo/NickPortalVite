import React from "react";
import ProductViewCard from "../../../Components/Card/ProductView";
import {
  useGetProductsQuery,
  useGetProductsByCategoryQuery,
  useGetProductsBySearchQuery,
  useGetProductsByPaymenTypeQuery,
  useGetProductsByOpenShopQuery,
} from "./Service.mjs";
import { useAppSelector } from "../../../Components/Common/hooks";
import { ProductDetail } from "../../../Components/DetailsModales/ProductDetail";
import { BuyCard } from "../../../Components/Card/BuyCard";

const Product = () => {
  const globalSearch = useAppSelector(
    (state) => state.globalConfig.globalSearch
  );
  const globalCategorySearch = useAppSelector(
    (state) => state.globalConfig.globalCategorySearch
  );

  const gloablSearchByPayment = useAppSelector(
    (state) => state.globalConfig.gloablSearchByPayment
  );

  const onSearchOpenStore = useAppSelector(
    (state) => state.globalConfig.onSearchOpenStore
  );

  const isProductDetailsModalOpen = useAppSelector(
    (state) => state.globalConfig.isProductDetailsModalOpen
  );

  const isOpenCartModal = useAppSelector(
    (state) => state.globalConfig.isOpenCartModal
  );

  const {
    data: storesByPayment,
    error: storesByPaymentError,
    refetch: storesByPaymentRefetch,
  } = useGetProductsByPaymenTypeQuery(gloablSearchByPayment, { refetchOnMountOrArgChange: true });

  const {
    data: storesByOpenStore,
    error: storesByOpenStoreError,
    refetch: storesByOpenStoreRefetch,
  } = useGetProductsByOpenShopQuery({ refetchOnMountOrArgChange: true });

  const { data, error, refetch } = useGetProductsQuery({ refetchOnMountOrArgChange: true });
  const {
    data: filterByCategory,
    error: filterCategoryError,
    refetch: filterByCategoryRefetch,
  } = useGetProductsByCategoryQuery(globalCategorySearch, { refetchOnMountOrArgChange: true });
  const {
    data: filterBySearch,
    error: filterSearchError,
    refetch: filterBySearchRefetch,
  } = useGetProductsBySearchQuery(globalSearch, { refetchOnMountOrArgChange: true });

  const [productDataList, setProductDataList] = React.useState(null);

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  React.useEffect(() => {
    if (filterBySearch?.data?.length > 0) {
      setProductDataList(filterBySearch?.data?.[0]?.["products"]);
    } else if (filterByCategory?.data?.length > 0) {
      setProductDataList(filterByCategory?.data);
    } else if (storesByPayment?.data?.length > 0) {
      setProductDataList(storesByPayment?.data?.[0]?.products);
    } else if (storesByOpenStore?.data?.length > 0 && onSearchOpenStore) {
      setProductDataList(storesByOpenStore?.data);
    } else if (data?.data?.length > 0) {
      setProductDataList(data?.data);
    } else {
      setProductDataList(null);
    }
  }, [
    filterByCategory,
    data,
    filterBySearch,
    storesByOpenStore,
    storesByPayment,
    onSearchOpenStore,
  ]);

  return (
    <>
      <div className="grid  mm:grid-cols-2 ml:grid-cols-2 sm:grid-cols-4  md:grid-cols-4  lg:grid-cols-5  xl:grid-cols-5 2xl:grid-cols-5 3xl:grid-cols-5 gap-2 mt-1">
        {productDataList?.length > 0
          ? productDataList?.map((item, index) => {
              return item?.createdType === "Store" ? (
                <ProductViewCard key={item?.id || index} item={item} />
              ) : null;
            })
          : null}
      </div>
      {isProductDetailsModalOpen?.isOpen && (
        <ProductDetail
          isOpen={isProductDetailsModalOpen?.isOpen}
          item={isProductDetailsModalOpen?.item}
        />
      )}

      {isOpenCartModal && <BuyCard isOpen={isOpenCartModal} />}
    </>
  );
};

export default Product;
