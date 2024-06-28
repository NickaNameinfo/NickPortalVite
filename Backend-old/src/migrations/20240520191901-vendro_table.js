"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Vendors", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      vendor_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      contact_person: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email_address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      alternative_number: {
        type: Sequelize.STRING,
      },
      tax_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      payment_terms: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      preferred_currency: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      services_provided: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      total_stores: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      number_category: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      vendor_image: {
        type: Sequelize.STRING,
      },
      vendor_document: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Vendors");
  },
};
