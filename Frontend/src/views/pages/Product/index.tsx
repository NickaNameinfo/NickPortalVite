import React from "react";
import ProductViewCard from "../../../Components/Card/ProductView";
import { useGetProductsQuery, useGetProductImgQuery } from "./Service.mjs";

const Product = () => {
  const { data, error, refetch } = useGetProductsQuery();
  return (
    <div className="grid  mm:grid-cols-2 ml:grid-cols-2 sm:grid-cols-4  md:grid-cols-4  lg:grid-cols-5  xl:grid-cols-5 2xl:grid-cols-5 3xl:grid-cols-5 gap-2 mt-1">
      {data?.data?.length > 0
        ? data?.data?.map((item) => {
            return item?.createdType === "Store" ? <ProductViewCard item={item} /> : null ;
          })
        : null}
    </div>
  );
};

export default Product;
