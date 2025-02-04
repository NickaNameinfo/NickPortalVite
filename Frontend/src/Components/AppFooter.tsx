import React from "react";
import { Link } from "react-router-dom";

const AppFooter = () => {
  return (
    <footer className="bg-default-400 flex flex-col md:flex-row px-5 py-3 rounded-t-small text-[0.55rem] justify-between items-center">
      <div className="text-center md:text-left mb-2 md:mb-0">
        <a
          href="https://nicknameportal.shop/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          nicknameportal
        </a>
        <span className="ms-1">&copy; 2024 Nickname.</span>
      </div>
      <ul className="flex flex-wrap justify-center space-x-3 mb-2 md:mb-0">
        <li>
          <Link to="/PrivacyPolicy" className="hover:underline">
            Privacy Policy
          </Link>
        </li>
        <li>
          <Link to="/ShippingPolicy" className="hover:underline">
            Shipping Policy
          </Link>
        </li>
        <li>
          <Link to="/TermsAndCondition" className="hover:underline">
            Terms And Condition
          </Link>
        </li>
        <li>
          <Link to="/CancellationAndRefund" className="hover:underline">
            Cancellation And Refund
          </Link>
        </li>
        <li>
          <Link to="/Contactus" className="hover:underline">
            Contact us
          </Link>
        </li>
        <li>
          <Link to="/Aboutus" className="hover:underline">
            About us
          </Link>
        </li>
      </ul>
      <div className="text-center md:text-right mt-2 md:mt-0">
        <span className="me-1">Powered by</span>
        <a
          href="nicknameinfotech.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Nickname Portal
        </a>
      </div>
    </footer>
  );
};

export default React.memo(AppFooter);
