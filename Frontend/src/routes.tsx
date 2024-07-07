import React from "react";
const StoreView = React.lazy(() => import("../src/views/pages/Store/index"));

const routes = [{ path: "/", name: "Dashboard", element: StoreView }];

export default routes;
