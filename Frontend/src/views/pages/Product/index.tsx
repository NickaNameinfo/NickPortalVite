import React from "react";
import ProductViewCard from "../../../Components/Card/ProductView";
import {
  useGetProductsQuery,
  useGetProductsByCategoryQuery,
  useGetProductsBySearchQuery,
  useGetProductsByPaymenTypeQuery,
  useGetProductsByOpenShopQuery
} from "./Service.mjs";
import { useAppSelector } from "../../../Components/Common/hooks";

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

  const {
    data: storesByPayment,
    error: storesByPaymentError,
    refetch: storesByPaymentRefetch,
  } = useGetProductsByPaymenTypeQuery(gloablSearchByPayment);

  const {
    data: storesByOpenStore,
    error: storesByOpenStoreError,
    refetch: storesByOpenStoreRefetch,
  } = useGetProductsByOpenShopQuery();

  const { data, error, refetch } = useGetProductsQuery();
  const {
    data: filterByCategory,
    error: filterCategoryError,
    refetch: filterByCategoryRefetch,
  } = useGetProductsByCategoryQuery(globalCategorySearch);
  const {
    data: filterBySearch,
    error: filterSearchError,
    refetch: filterBySearchRefetch,
  } = useGetProductsBySearchQuery(globalSearch);

  const [productDataList, setProductDataList] = React.useState(null);

  React.useEffect(() => {
    refetch();
  }, []);

  React.useEffect(() => {
    filterByCategoryRefetch();
    filterBySearchRefetch();
    storesByPaymentRefetch()
    storesByOpenStoreRefetch()
  }, [globalCategorySearch, globalSearch]);

  React.useEffect(() => {
    if (filterBySearch?.data?.length > 0) {
      setProductDataList(filterBySearch?.data?.[0]?.['products']);
    } else if (filterByCategory?.data?.length > 0) {
      setProductDataList(filterByCategory?.data);
    }else if(storesByPayment?.data?.length > 0 ){
      setProductDataList(storesByPayment?.data?.[0]?.products)
    }else if(storesByOpenStore?.data?.length > 0 && onSearchOpenStore){
      setProductDataList(storesByOpenStore?.data);
    } else if (data?.data?.length > 0) {
      setProductDataList(data?.data);
    }
  }, [filterByCategory, data, filterBySearch, storesByOpenStore, storesByPayment, onSearchOpenStore]);

  return (
    <div className="grid  mm:grid-cols-2 ml:grid-cols-2 sm:grid-cols-4  md:grid-cols-4  lg:grid-cols-5  xl:grid-cols-5 2xl:grid-cols-5 3xl:grid-cols-5 gap-2 mt-1">
      {productDataList?.length > 0
        ? productDataList?.map((item) => {
            return item?.createdType === "Store" ? (
              <ProductViewCard item={item} />
            ) : null;
          })
        : null}
    </div>
  );
};

export default Product;
