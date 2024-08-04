'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('vendor', 'location', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the new column
    await queryInterface.removeColumn('vendor', 'location');
  }
};
