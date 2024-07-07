import React from "react";
import { useNavigate } from "react-router-dom";
import { AppContent, AppSidebar } from "../Components";

const DefaultLayout = () => {
  return (
    <div>
      <main className="mytheme text-foreground overflow-hidden p-4">
        <div className="flex">
          <AppSidebar />
          <div className="mm:w-full ml:w-full sm:w-fullv md:w-full lg:w-full xl:w-full 2xl:w-full 3xl:w-full 4xl:w-full px-3 custom-scrollbar bg-white rounded-medium">
            <div className="mt-2 pb-3">
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
