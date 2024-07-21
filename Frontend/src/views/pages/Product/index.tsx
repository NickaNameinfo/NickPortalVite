import React from "react";
import ProductViewCard from "../../../Components/Card/ProductView";
import { useGetProductsQuery } from "./Service.mjs";

const Product = () => {
  const { data, error, refetch } = useGetProductsQuery();
  console.log(data?.data, "asdhfasodufh23");

  return (
    <div>
      <ProductViewCard loadData={data?.data} />
    </div>
  );
};

export default Product;
