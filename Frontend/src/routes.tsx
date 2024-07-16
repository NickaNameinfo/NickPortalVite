import React from "react";
const StoreView = React.lazy(() => import("../src/views/pages/Store/index"));
const ProductView = React.lazy(
  () => import("../src/views/pages/Product/index")
);
const VendoreView = React.lazy(() => import("../src/views/pages/Vendor/index"));

const routes = [
  { path: "/", name: "Dashboard", element: StoreView },
  { path: "/ProductView", name: "ProductView", element: ProductView },
  { path: "/VendoreView", name: "ProductView", element: VendoreView },
];

export default routes;
