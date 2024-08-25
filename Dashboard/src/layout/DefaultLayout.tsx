import React from "react";
import { useNavigate } from "react-router-dom";
import { AppContent, AppSidebar } from "../Components";
import { getCookie } from "../JsFiles/CommonFunction.mjs";
const DefaultLayout = () => {
  const navigate = useNavigate();
  const token = getCookie("token")
  React.useEffect(() => {
    if (!token) {
      navigate("/");
    } 
  }, [token]);

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
    </div>
  );
};

export default DefaultLayout;
