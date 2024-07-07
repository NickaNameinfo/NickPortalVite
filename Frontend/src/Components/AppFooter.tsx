import React from "react";

const AppFooter = () => {
  return (
    <footer>
      <div>
        <a href="https://coreui.io" target="_blank" rel="noopener noreferrer">
          CoreUI
        </a>
        <span className="ms-1">&copy; 2024 Nickname.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a
          href="nicknameinfotech.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Admin &amp; Dashboard Template
        </a>
      </div>
    </footer>
  );
};

export default React.memo(AppFooter);
