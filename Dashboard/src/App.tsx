import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import React, { Suspense } from "react";
import Login from "./views/pages/login/Login.js";
import DefaultLayout from "./layout/DefaultLayout.js";
import Page404 from "./views/pages/page404/Page404.js";
import Page500 from "./views/pages/page500/Page500.js";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

function App() {
  return (
    <Suspense fallback={loading}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />
          <Route path="*" index element={<DefaultLayout />} />
        </Routes>
      </Router>
    </Suspense>
  );
}

export default App;
