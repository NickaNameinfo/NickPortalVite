import React from "react";

const ShippingPolicy = () => {
  return (
    <div className="embed-preview-wrap bg-gray-50 p-4 rounded-md shadow-md">
      <div className="embed-preview content-panel no-select bg-white p-6 rounded-md shadow-sm">
        <p className="text-gray-700">
          This shipping policy explains how nicknameportal operates its shipping procedures and how we strive to meet your expectations with every order. Whether you’re a first-time buyer or a returning customer, we want to ensure that your experience with us is smooth and satisfactory, right from placing your order to the moment it arrives at your doorstep.
          
        </p>
        <p className="text-gray-700 mt-4">
          Please read this shipping policy together with our{" "}
          <a
            href="https://nicknameportal.shop/TermsAndCondition"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            terms and conditions
          </a>{" "}
          to familiarize yourself with the rest of our general guidelines.
        </p>
        <div className="wpembed-toc mt-6">
          <h3 className="text-lg font-semibold text-gray-800">Table of Contents</h3>
          <ol className="list-decimal list-inside text-gray-700">
            <li>
              <a href="#shipping-and-delivery-options" className="text-blue-500 hover:underline">
                Shipping and Delivery Options
              </a>
            </li>
            <li>
              <a href="#delayed-orders" className="text-blue-500 hover:underline">
                Delayed Orders
              </a>
            </li>
            <li>
              <a href="#returns-and-exchanges" className="text-blue-500 hover:underline">
                Returns and Exchanges
              </a>
            </li>
            <li>
              <a href="#contact-information" className="text-blue-500 hover:underline">
                Contact Information
              </a>
            </li>
          </ol>
        </div>
        <h2 id="shipping-and-delivery-options" className="text-xl font-bold text-gray-800 mt-8">
          Shipping and Delivery Options
        </h2>
        <p className="text-gray-700 mt-2">We offer a variety of shipping options to suit the needs of our customers.</p>
        <h3 className="text-lg font-semibold text-gray-800 mt-4">Free Shipping</h3>
        <p className="text-gray-700 mt-2">
          As part of our commitment to an exceptional shopping experience, we are pleased to offer free shipping orders
          over 300.
        </p>
        <h3 className="text-lg font-semibold text-gray-800 mt-4">Shipping Methods</h3>
        <p className="text-gray-700 mt-2">We offer a variety of shipping options to suit the needs of our customers:</p>
        <ul className="list-disc list-inside text-gray-700">
          <li>Standard: 2 to 7 days</li>
          <li>Expedited: 2 to 4 days</li>
        </ul>
        <p className="text-gray-700 mt-2">
          In certain situations, we may collaborate with a third-party supplier who might handle our inventory and take
          charge of shipping your products.
        </p>
        <h3 className="text-lg font-semibold text-gray-800 mt-4">In-store Pickups</h3>
        <p className="text-gray-700 mt-2">
          We offer a convenient local pickup option for those who prefer to collect their orders in person. It is
          designed to provide a fast and efficient way for local customers to receive their products without waiting for
          home delivery.
        </p>
        <p className="text-gray-700 mt-2">Please wait for the confirmation email before coming to the store to pick up your order.</p>
        <p className="text-gray-700 mt-2">Pickup hours are as follows: Monday to Friday between 9 AM to 9 PM.</p>
        <p className="text-gray-700 mt-2">This process helps to ensure that orders are safely and accurately handed over to the right person.</p>
        <h2 id="delayed-orders" className="text-xl font-bold text-gray-800 mt-8">Delayed Orders</h2>
        <p className="text-gray-700 mt-2">
          Unexpected delays can occur due to various reasons such as logistic challenges, inclement weather, high
          demand, or carrier issues. We are committed to handling these situations with transparency and efficiency. In
          the event of a delay, our priority is to keep you informed. We will promptly notify you with updates on the
          status of your order and the expected new delivery time. Our goal is to provide clear and accurate information
          so you can plan accordingly.
        </p>
        <p className="text-gray-700 mt-2">
          Understanding the inconvenience caused by delays, we offer options to maintain your satisfaction. If your
          order is significantly delayed, you will have the choice to continue with the order, modify it, or cancel it
          for a full refund. Our customer service team is always available to assist with any changes to your order.
        </p>
        <h2 id="returns-and-exchanges" className="text-xl font-bold text-gray-800 mt-8">Returns and Exchanges</h2>
        <p className="text-gray-700 mt-2">
          If you have any questions about refunds, returns, or exchanges, please review our{" "}
          <a
            href="https://nicknameportal.shop/CancellationAndRefund"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            refund policy
          </a>.
        </p>
        <h2 id="contact-information" className="text-xl font-bold text-gray-800 mt-8">Contact Information</h2>
        <p className="text-gray-700 mt-2">
          If you have any questions or concerns regarding our shipping policy, we encourage you to contact us using the
          details below:
        </p>
        <ul className="list-disc list-inside text-gray-700">
          <li>
            <a href="mailto:support@nicknameinfotech.com" className="text-blue-500 hover:underline">
              support@nicknameinfotech.com
            </a>
          </li>
          <li>15/7 Sivaji Street, T-Nagar, Chennai - 600017</li>
        </ul>
        <p className="text-gray-500 text-sm mt-4">This document was last updated on January 20, 2025.</p>
      </div>
    </div>
  );
};

export default ShippingPolicy;
