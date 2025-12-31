import React from "react";
import { useNavigate } from "react-router-dom";
import { AppContent, AppSidebar } from "../Components";
import { getCookie } from "../JsFiles/CommonFunction.mjs";
import { ToastContainer } from "react-toastify";
import { useDisableRightClick } from "../utils/rightClickHandler";
const DefaultLayout = () => {
  const navigate = useNavigate();
  // Check both token cookies
  const token = getCookie("token") || getCookie("XSRF-token");
  
  // Disable right-click for security (can be configured via environment variable)
  const disableRightClick = import.meta.env.VITE_DISABLE_RIGHT_CLICK !== 'false';
  useDisableRightClick(disableRightClick, false);
  
  React.useEffect(() => {
    if (!token) {
      console.log('[DefaultLayout] No token found, redirecting to login');
      navigate("/");
    } 
  }, [token, navigate]);

  return (
    <div>
      <main className="mytheme text-foreground overflow-hidden p-4">
        <div className="flex">
          <AppSidebar />
          <div
            className="bg-white mm:w-full ml:w-full sm:w-fullv md:w-full lg:w-full xl:w-full 2xl:w-full 3xl:w-full 4xl:w-full ps-2 pe-1 custom-scrollbar  rounded-medium pb-4"
            style={{ height: "calc(100vh - 33px)", overflow: "hidden" }}
          >
            <div
              className="mt-2 pb-3"
              style={{ height: "100%", overflowY: "auto" }}
            >
              <AppContent />
            </div>
          </div>
        </div>
        {/* <AppFooter /> */}
      </main>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default DefaultLayout;
