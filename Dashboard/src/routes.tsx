import React from "react";
const AddVendors = React.lazy(() => import("../src/views/vendors/Add"));
const VendorsList = React.lazy(() => import("../src/views/vendors/List"));

const routes = [
  { path: "/", exact: false, name: "Home" },
  { path: "/Vendors/Add", name: "Dashboard", element: AddVendors },
  { path: "/Vendors/List", name: "Dashboard", element: VendorsList },
];

export default routes;
