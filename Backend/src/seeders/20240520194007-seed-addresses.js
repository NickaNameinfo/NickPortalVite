"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Vendors", [
      {
        vendor_name: "Vendor One",
        address_id: 1,
        contact_person: "John Doe",
        email_address: "vendor1@example.com",
        phone_number: "1234567890",
        alternative_number: "0987654321",
        tax_id: "TAX123456",
        payment_terms: "Net 30",
        preferred_currency: "USD",
        services_provided: "Service A, Service B",
        total_stores: 10,
        number_category: 5,
        vendor_image: "path/to/vendor1-image.jpg",
        vendor_document: "path/to/vendor1-document.pdf",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        vendor_name: "Vendor Two",
        address_id: 2,
        contact_person: "Jane Smith",
        email_address: "vendor2@example.com",
        phone_number: "2345678901",
        alternative_number: "1987654321",
        tax_id: "TAX654321",
        payment_terms: "Net 45",
        preferred_currency: "EUR",
        services_provided: "Service C, Service D",
        total_stores: 20,
        number_category: 3,
        vendor_image: "path/to/vendor2-image.jpg",
        vendor_document: "path/to/vendor2-document.pdf",
        status: "inactive",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Vendors", null, {});
  },
};
