"use strict";

module.exports = (sequelize, DataTypes) => {
  const Vendor = sequelize.define(
    "Vendor",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      vendor_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      contact_person: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email_address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      alternative_number: {
        type: DataTypes.STRING,
      },
      tax_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      payment_terms: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      preferred_currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      services_provided: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      total_stores: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      number_category: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      vendor_image: {
        type: DataTypes.STRING,
      },
      vendor_document: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "Vendors",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    }
  );

  Vendor.associate = function (models) {
    // associations can be defined here
    // e.g., Vendor.belongsTo(models.Address, { foreignKey: 'address_id' });
  };

  return Vendor;
};
