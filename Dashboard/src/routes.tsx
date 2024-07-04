import React from "react";
const AddVendors = React.lazy(() => import("../src/views/vendors/Add"));
const VendorsList = React.lazy(() => import("../src/views/vendors/List"));
const AddStock = React.lazy(() => import("../src/views/vendors/Stock/AddStock"));
const CategoriesAdd = React.lazy(() => import("../src/views/Categories/CategoriesAdd"));
const AddProducts = React.lazy(() => import("../src/views/Products/AddProducts"));
const ProductsList = React.lazy(() => import("../src/views/Products/ProductsList"));

const routes = [
  { path: "/", exact: false, name: "Home" },
  { path: "/Vendors/Add", name: "Dashboard", element: AddVendors },
  { path: "/Vendors/List", name: "Dashboard", element: VendorsList },
  { path: "/CategoriesAdd", name: "CategoriesAdd", element: CategoriesAdd },
  { path: "/AddProducts", name: "AddProducts", element: AddProducts },
  { path: "/ProductsList", name: "ProductsList", element: ProductsList },
  { path: "/AddStock", name: "AddStock", element: AddStock },
];

export default routes;
