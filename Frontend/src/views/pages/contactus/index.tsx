import React from "react";

const ContactUs = () => {
  return (
    <div className="bg-gray-50 text-gray-800 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">
          Contact Us
        </h1>
        <p className="text-lg text-center mb-8">
          We're here to help! Feel free to reach out to us through any of the channels below.
        </p>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Phone */}
          <div className="bg-white shadow-md p-6 rounded-lg text-center">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Phone</h2>
            <p className="text-lg">
              <a href="tel:+918270564998" className="text-blue-500 hover:underline">
                +91 82705 64998
              </a>
            </p>
          </div>

          {/* Email */}
          <div className="bg-white shadow-md p-6 rounded-lg text-center">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Email</h2>
            <p className="text-lg">
              <a href="mailto:support@nicknameinfotech.com" className="text-blue-500 hover:underline">
                support@nicknameinfotech.com
              </a>
            </p>
          </div>

          {/* Address */}
          <div className="bg-white shadow-md p-6 rounded-lg text-center">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Address</h2>
            <p className="text-lg">
              15/7 Sivaji Street, <br />
              T-Nagar, Chennai - 600017
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
