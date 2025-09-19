import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
import DefaultLayout from "./layout/DefaultLayout.js";
import Page404 from "./views/pages/page404/Page404.js";
import Page500 from "./views/pages/page500/Page500.js";
import { getCookie } from "../src/JsFiles/CommonFunction.mjs";
import { useGetUserQuery } from "./Service.mjs";
import { useAppDispatch } from "./Components/Common/hooks.js";
import { onUpdateStoreList, updateLoginDetails } from "./Components/Common/globalSlice.js";
import { useGetStoresQuery } from "./views/pages/Store/Service.mjs";
import "react-toastify/dist/ReactToastify.css";
import 'sweetalert2/src/sweetalert2.scss'
import "yet-another-react-lightbox/styles.css";
import "react-photo-album/rows.css";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

function App() {
  const id = getCookie("id");
  const dispatch = useAppDispatch();
  const { data, error, refetch } = useGetUserQuery(id);
  const { data: storeDetails, error: storeDetailsError, refetch: storeDetailsRefetch } = useGetStoresQuery();

  React.useEffect(() => {
    refetch();
    getLocation()
  }, [id]);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          localStorage.setItem("latitude", String(position.coords.latitude));
          localStorage.setItem("longitude", String(position.coords.longitude));
        },
        (err) => {
          console.log(err.message, "location error");
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  React.useEffect(() => {
    if (data?.data) {
      dispatch(updateLoginDetails(data));
    }
  }, [data]);

  React.useEffect(() => {
    if (storeDetails) {
      dispatch(onUpdateStoreList(storeDetails?.data))
    }
  }, [storeDetails])


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
