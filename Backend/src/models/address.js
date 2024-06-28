'use strict';
module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('addresses', {
    fullname: DataTypes.STRING,
    phone: DataTypes.STRING,
    orderId: DataTypes.INTEGER,
    custId: DataTypes.INTEGER,
    discrict: DataTypes.STRING,
    city: DataTypes.STRING,
    states: DataTypes.STRING, 
    area: DataTypes.STRING,
    shipping: DataTypes.TEXT
  }, {});
  Address.associate = function(models) {
    // associations can be defined here
    models.addresses.belongsTo(models.orders, { foreignKey: 'orderId' });  
    models.addresses.hasMany(models.carts, { foreignKey: 'addressId' });  
    models.addresses.belongsTo(models.customer, { foreignKey: 'custId' });      
  };
  return Address;
};