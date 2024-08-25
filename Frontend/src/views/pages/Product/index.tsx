import React from "react";
import ProductViewCard from "../../../Components/Card/ProductView";
import { useGetProductsQuery, useGetProductImgQuery } from "./Service.mjs";

const Product = () => {
  const { data, error, refetch } = useGetProductsQuery();
  const {
    data: imgData,
    error: imgError,
    refetch: imgrefetch,
  } = useGetProductImgQuery();
  console.log("useGetProductsQuery", imgData?.data);

  return (
    <div>
      <ProductViewCard loadData={imgData?.data} />
    </div>
  );
};

export default Product;
