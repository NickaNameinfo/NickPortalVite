import React from "react";
import StoreCard from "../../../Components/Card/StoreCard";
import {
  useGetStoresQuery,
  useGetStoresByCategoryQuery,
  useGetStoresByFiltersQuery,
  useGetStoresByPaymentTypeQuery,
  useGetStoresByOpenStoreQuery,
} from "./Service.mjs";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../Components/Common/hooks";
import {
  onResetModals,
  onUpdateCartModal,
  onUpdateProductDetailsModal,
  onUpdateStoreList,
} from "../../../Components/Common/globalSlice";
import { ProductDetail } from "../../../Components/DetailsModales/ProductDetail";
import { BuyCard } from "../../../Components/Card/BuyCard";

const Store = () => {
  const dispatch = useAppDispatch();
  const { data, error, refetch } = useGetStoresQuery();
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
    data: storesByCategory,
    error: storeByError,
    refetch: storeByCategoryRefetch,
  } = useGetStoresByCategoryQuery(globalCategorySearch);

  const {
    data: storesByFilter,
    error: storeByFilterError,
    refetch: storeByFilterRefetch,
  } = useGetStoresByFiltersQuery(globalSearch);

  const {
    data: storesByPayment,
    error: storesByPaymentError,
    refetch: storesByPaymentRefetch,
  } = useGetStoresByPaymentTypeQuery(gloablSearchByPayment);

  const {
    data: storesByOpenStore,
    error: storesByOpenStoreError,
    refetch: storesByOpenStoreRefetch,
  } = useGetStoresByOpenStoreQuery();

  const [storeDataList, setStoreDataList] = React.useState(null);

  React.useEffect(() => {
    refetch();
    dispatch(onResetModals());
  }, []);

  React.useEffect(() => {
    if (storeDataList) {
      dispatch(onUpdateStoreList(storeDataList?.data));
    }
  }, [storeDataList]);

  React.useEffect(() => {
    storeByCategoryRefetch();
    storeByFilterRefetch();
    storesByPaymentRefetch();
    storesByOpenStoreRefetch();
  }, [globalCategorySearch, globalSearch]);

  React.useEffect(() => {
    if (storesByFilter?.data?.length > 0) {
      setStoreDataList(storesByFilter);
    } else if (storesByCategory?.data?.length > 0) {
      setStoreDataList(storesByCategory);
    } else if (storesByPayment?.data?.length > 0) {
      setStoreDataList(storesByPayment);
    } else if (storesByOpenStore?.data?.length > 0 && onSearchOpenStore) {
      setStoreDataList(storesByOpenStore);
    } else if (data?.data?.length > 0) {
      setStoreDataList(data);
    }
  }, [storesByCategory, data, storesByFilter, storesByPayment]);

  return (
    <>
      <div className="grid mm:grid-cols-2 ml:grid-cols-2 sm:grid-cols-4  md:grid-cols-4  lg:grid-cols-4  xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-4 gap-2 mt-2">
        {storeDataList?.data?.map((item, index) => {
          return <StoreCard item={item} key={index} />;
        })}
      </div>
    </>
  );
};

export default Store;
