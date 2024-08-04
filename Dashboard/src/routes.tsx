import React from "react";
const AddVendors = React.lazy(() => import("../src/views/vendors/Add"));
const EditVendors = React.lazy(() => import("../src/views/vendors/Add"));
const VendorsList = React.lazy(() => import("../src/views/vendors/List"));
const AddStock = React.lazy(
  () => import("../src/views/vendors/Stock/AddStock")
);
const CategoriesAdd = React.lazy(
  () => import("../src/views/Categories/CategoriesAdd")
);
const AddProducts = React.lazy(
  () => import("../src/views/Products/AddProducts")
);
const ProductsList = React.lazy(
  () => import("../src/views/Products/ProductsList")
);
const AddStores = React.lazy(() => import("../src/views/Store/AddStore"));
const EditStores = React.lazy(() => import("../src/views/Store/AddStore"));
const StoresList = React.lazy(() => import("../src/views/Store/StoreList"));
const VendorProducts = React.lazy(() => import("../src/views/VendorProducts/index"));
const VendorDetails = React.lazy(() => import("../src/views/VendorProducts/VendorDetails/index"));

const routes = [
  { path: "/", exact: false, name: "Home" },
  { path: "/Vendors/Add", name: "Dashboard", element: AddVendors },
  { path: "/Vendors/Edit/:id", name: "Dashboard", element: EditVendors },
  { path: "/Vendors/List", name: "Dashboard", element: VendorsList },
  { path: "/CategoriesAdd", name: "CategoriesAdd", element: CategoriesAdd },
  { path: "/AddProducts", name: "AddProducts", element: AddProducts },
  { path: "/ProductsList", name: "ProductsList", element: ProductsList },
  { path: "/AddStock", name: "AddStock", element: AddStock },
  { path: "/Stores/Add", name: "AddStores", element: AddStores },
  { path: "/Stores/Edit/:id", name: "EditStores", element: EditStores },
  { path: "/Stores/List", name: "StoresList", element: StoresList },
  { path: "/Vendors/Products", name: "VendorProductList", element: VendorProducts },
  { path: "/Vendors/Products/Details", name: "VendorProductDetails", element: VendorDetails },
];

export default routes;
