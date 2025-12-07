import React from "react";
import { useNavigate } from "react-router-dom";
import { AppContent, AppFooter, AppHeader, AppSidebar } from "../Components";
import { ToastContainer } from "react-toastify";

const DefaultLayout = () => {
  return (
    <div>

      {/* <marquee className="bg-yellow-200 text-yellow-800 p-2">
        📢 We are currently collaborating with stores and will enable ordering soon.
      </marquee> */}
      <main className="mytheme text-foreground overflow-hidden pt-4 px-1">
        <div className="flex">
          <AppSidebar />
          <div className="mm:w-full ml:w-full sm:w-fullv md:w-full lg:w-full xl:w-full 2xl:w-full 3xl:w-full 4xl:w-full ps-3 pe-1 custom-scrollbar">
            <AppHeader />
            <div className="appContentViewHeight overflow-auto navBarStyle p-4">
              <AppContent />
            </div>
          </div>
        </div>
      </main>
      <AppFooter />
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
