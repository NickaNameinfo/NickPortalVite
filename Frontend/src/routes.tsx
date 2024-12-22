import React from "react";
const StoreView = React.lazy(() => import("../src/views/pages/Store/index"));
const StoreDetails = React.lazy(
  () => import("../src/views/pages/Store/StoreDetails/index")
);
const ProductView = React.lazy(
  () => import("../src/views/pages/Product/index")
);
const VendoreView = React.lazy(() => import("../src/views/pages/Vendor/index"));
const MapView = React.lazy(() => import("../src/views/pages/MapView/index"));

const routes = [
  { path: "/", name: "Dashboard", element: StoreView },
  { path: "/ProductView", name: "ProductView", element: ProductView },
  {
    path: "/Store/StoreDetails/:id",
    name: "StoreDetails",
    element: StoreDetails,
  },
  { path: "/VendorView", name: "vendorView", element: VendoreView },
  { path: "/MapView", name: "MapView", element: MapView },
];

export default routes;
