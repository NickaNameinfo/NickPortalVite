import React from "react";
import { useNavigate } from "react-router-dom";
import { AppContent, AppHeader, AppSidebar } from "../Components";

const DefaultLayout = () => {
  return (
    <div>
      <main className="mytheme text-foreground overflow-hidden py-4 px-1">
        <div className="flex">
          <AppSidebar />
          <div className="mm:w-full ml:w-full sm:w-fullv md:w-full lg:w-full xl:w-full 2xl:w-full 3xl:w-full 4xl:w-full ps-3 pe-1 custom-scrollbar">
            <AppHeader />
            <div className="appContentViewHeight overflow-auto navBarStyle p-4">
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
