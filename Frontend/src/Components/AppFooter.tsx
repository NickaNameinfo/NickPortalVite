import React from "react";

const AppFooter = () => {
  return (
    <footer className="bg-default-400 flex px-5 rounded-t-small text-[0.55rem] justify-between">
      <div>
        <a
          href="https://nicknameportal.shop/"
          target="_blank"
          rel="noopener noreferrer"
        >
          nicknameportal
        </a>
        <span className="ms-1">&copy; 2024 Nickname.</span>
      </div>
      <ul className="flex space-x-3 ml-3">
        <li><a href="/PrivacyPolicy" target="_blank">Privacy Policy</a></li>
        <li><a href="/TermsAndCondition" target="_blank">Terms And  Condition</a></li>
        <li><a href="/CancellationAndRefund" target="_blank">Cancellation And Refund</a></li>
        <li><a href="/Contactus" target="_blank">Contact us</a></li> cla
        <li><a href="/Aboutus" target="_blank">About us</a></li>
      </ul>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a
          href="nicknameinfotech.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Nickname Portal
        </a>
      </div>
    </footer>
  );
};

export default React.memo(AppFooter);
