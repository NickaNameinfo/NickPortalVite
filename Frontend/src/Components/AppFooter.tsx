import React from "react";
import { Link } from "react-router-dom";

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
        <li><Link to="/PrivacyPolicy">Privacy Policy</Link></li>
        <li><Link to="/ShippingPolicy">Shipping Policy</Link></li>
        <li><Link to="/TermsAndCondition">Terms And  Condition</Link></li>
        <li><Link to="/CancellationAndRefund">Cancellation And Refund</Link></li>
        <li><Link to="/Contactus">Contact us</Link></li> 
        <li><Link to="/Aboutus">About us</Link></li>
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
