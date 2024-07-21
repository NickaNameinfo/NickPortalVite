'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn('stores', 'website', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.addColumn('stores', 'storeImage', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.addColumn('stores', 'openTime', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.addColumn('stores', 'closeTime', {
        type: Sequelize.STRING,
        allowNull: true
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn('stores', 'website'),
      queryInterface.removeColumn('stores', 'storeImage'),
      queryInterface.removeColumn('stores', 'openTime'),
      queryInterface.removeColumn('stores', 'closeTime'),
    ]);
  }
};
