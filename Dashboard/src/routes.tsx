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
const VendorProducts = React.lazy(
  () => import("../src/views/VendorProducts/index")
);
const VendorDetails = React.lazy(
  () => import("../src/views/VendorProducts/VendorDetails/index")
);
const Subscriptions = React.lazy(
  () => import("../src/views/Subscriptions/index")
);
const Dashboard = React.lazy(() => import("../src/views/Dashboard/index"));

const routes = [
  { path: "/", exact: false, name: "Home" },
  { path: "/Dashboard", exact: false, name: "Dashboard", element: Dashboard },
  { path: "/Vendors/Add", name: "Dashboard", element: AddVendors },
  { path: "/Vendors/Edit/:itemId", name: "Dashboard", element: EditVendors },
  { path: "/Vendors/List", name: "Dashboard", element: VendorsList },
  { path: "/CategoriesAdd", name: "CategoriesAdd", element: CategoriesAdd },
  {
    path: "/AddProducts/:productId?",
    name: "AddProducts",
    element: AddProducts,
  },
  { path: "/ProductsList", name: "ProductsList", element: ProductsList },
  { path: "/AddStock", name: "AddStock", element: AddStock },
  { path: "/Stores/Add", name: "AddStores", element: AddStores },
  { path: "/Stores/Edit/:itemId", name: "EditStores", element: EditStores },
  { path: "/Stores/List", name: "StoresList", element: StoresList },
  {
    path: "/Vendors/Products",
    name: "VendorProductList",
    element: VendorProducts,
  },
  {
    path: "/Vendors/Products/Details/:id",
    name: "VendorProductDetails",
    element: VendorDetails,
  },
  { path: "/Subscriptions", name: "Subscriptions", element: Subscriptions },
];

export default routes;
