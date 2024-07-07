import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
// routes config
import routes from "../routes";
import { Spinner } from "@nextui-org/react";

const AppContent = () => {
  return (
    <Suspense fallback={<Spinner color="primary" />}>
      <Routes>
        {routes.map((route, idx) => {
          return (
            route.element && (
              <Route key={idx} path={route.path} element={<route.element />} />
            )
          );
        })}
        <Route path="/" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default React.memo(AppContent);
