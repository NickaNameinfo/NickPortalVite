'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('carts', {
    productId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    orderId: DataTypes.INTEGER,
    addressId: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    total: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    photo: DataTypes.STRING
  }, {});
  Cart.associate = function(models) {
    // associations can be defined here
    models.carts.belongsTo(models.addresses, { foreignKey: 'addressId' });  
    models.carts.belongsTo(models.orders, { foreignKey: 'orderId' });
  };
  return Cart;
}; 