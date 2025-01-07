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
const PrivacyPolicy = React.lazy(() => import("../src/views/pages/privacyPolicy/index"));
const TermsAndCondition = React.lazy(() => import("../src/views/pages/termsAndCondition/index"));
const CancellationAndRefund = React.lazy(() => import("../src/views/pages/cancellationAndRefund/index"));
const Contactus = React.lazy(() => import("../src/views/pages/contactus/index"));
const Aboutus = React.lazy(() => import("../src/views/pages/aboutus/index"));

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
  { path: "/PrivacyPolicy", name: "PrivacyPolicy", element: PrivacyPolicy },
  { path: "/TermsAndCondition", name: "MapView", element: TermsAndCondition },
  { path: "/CancellationAndRefund", name: "MapView", element: CancellationAndRefund },
  { path: "/Contactus", name: "MapView", element: Contactus },
  { path: "/Aboutus", name: "MapView", element: Aboutus },
];

export default routes;
