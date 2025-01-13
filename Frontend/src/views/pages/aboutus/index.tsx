import React from "react";

const AboutUs = () => {
  return (
    <div className="bg-gray-50 text-gray-800 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">
          About Us
        </h1>

        {/* Intro Section */}
        <p className="text-lg text-center mb-8">
          Welcome to <span className="font-bold">NicknamePortal</span> – Your One-Stop Destination for All Things Unique!
        </p>

        {/* Who We Are */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
          <p className="text-base leading-relaxed">
            We’re a team of passionate entrepreneurs dedicated to curating a wide range of products that cater to your lifestyle. Whether you’re looking for the latest gadgets, fashion-forward trends, or must-have home essentials, we’ve got you covered.
          </p>
          <ul className="list-disc list-inside mt-4">
            <li><strong>Quality First:</strong> We carefully vet every product to ensure it meets our high standards.</li>
            <li><strong>Affordability:</strong> Great value shouldn’t come at a high price.</li>
            <li><strong>Customer-Centric:</strong> Your satisfaction is our top priority.</li>
          </ul>
        </section>

        {/* Why Choose Us */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Diverse Selection:</strong> Explore our extensive catalog that’s constantly updated with new arrivals.</li>
            <li><strong>Secure Shopping:</strong> Shop with confidence knowing that your data is protected with top-notch security.</li>
            <li><strong>Fast Delivery:</strong> Get your orders quickly with our streamlined shipping process.</li>
            <li><strong>Exceptional Support:</strong> Have questions? Our friendly customer service team is here to help.</li>
          </ul>
        </section>

        {/* Vision */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
          <p className="text-base leading-relaxed">
            We aim to redefine the online shopping experience by making it fun, effortless, and tailored to you. At NicknamePortal, you’re not just a customer – you’re part of our family.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
