'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add 'url' column
    await queryInterface.addColumn('recipes', 'url', {
      type: Sequelize.STRING,
      allowNull: true, // or false, depending on whether this field is required
    });

    // Add 'hostname' column
    await queryInterface.addColumn('recipes', 'hostname', {
      type: Sequelize.STRING,
      allowNull: true, // or false, as per your requirements
    });

    // Add 'image_url' column
    await queryInterface.addColumn('recipes', 'image_url', {
      type: Sequelize.STRING,
      allowNull: true, // adjust based on whether this column can be empty
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Corresponding removal of columns in reverse order
    await queryInterface.removeColumn('recipes', 'image_url');
    await queryInterface.removeColumn('recipes', 'hostname');
    await queryInterface.removeColumn('recipes', 'url');
  }
};
