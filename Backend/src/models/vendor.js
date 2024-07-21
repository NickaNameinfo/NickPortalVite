"use strict";
module.exports = (sequelize, DataTypes) => {
  const vendor = sequelize.define(
    "vendor",
    {
      storename: DataTypes.STRING,
      status: DataTypes.INTEGER,
      shopaddress: DataTypes.TEXT,
      shopdesc: DataTypes.TEXT,
      ownername: DataTypes.STRING,
      owneraddress: DataTypes.TEXT,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phone: DataTypes.TEXT,
      areaId: DataTypes.INTEGER,
      accountNo: DataTypes.STRING,
      accountHolderName: DataTypes.STRING,
      bankName: DataTypes.STRING,
      IFSC: DataTypes.STRING,
      branch: DataTypes.STRING,
      adharCardNo: DataTypes.INTEGER,
      panCardNo: DataTypes.STRING,
      GSTNo: DataTypes.STRING,
      website: DataTypes.STRING,
      vendorImage: DataTypes.STRING,
      openTime: DataTypes.STRING,
      closeTime: DataTypes.STRING,
    },
    {}
  );
  vendor.associate = function (models) {
    // associations can be defined here
    models.vendor.belongsTo(models.area, { foreignKey: "areaId" });
    models.vendor.hasMany(models.vendor_product, { foreignKey: "supplierId" });
    models.vendor.hasMany(models.vendorStock, { foreignKey: "vendorId" });
  };
  return vendor;
};
