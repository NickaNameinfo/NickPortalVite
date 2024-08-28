import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
import DefaultLayout from "./layout/DefaultLayout.js";
import Page404 from "./views/pages/page404/Page404.js";
import Page500 from "./views/pages/page500/Page500.js";
import { getCookie } from "../src/JsFiles/CommonFunction.mjs";
import { useGetUserQuery } from "./Service.mjs";
import { useAppDispatch } from "./Components/Common/hooks.js";
import { updateLoginDetails } from "./Components/Common/globalSlice.js";
import "react-toastify/dist/ReactToastify.css";
import 'sweetalert2/src/sweetalert2.scss'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

function App() {
  const id = getCookie("id");
  const dispatch = useAppDispatch();
  const { data, error, refetch } = useGetUserQuery(id);

  React.useEffect(() => {
    refetch();
  }, [id]);

  React.useEffect(() => {
    if (data?.data) {
      dispatch(updateLoginDetails(data));
    }
  }, [data]);

  return (
    <Suspense fallback={loading}>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Login />} /> */}
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />
          <Route path="*" index element={<DefaultLayout />} />
        </Routes>
      </Router>
    </Suspense>
  );
}

export default App;
